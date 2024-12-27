import { Component } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  utilisateurs: any[] = [];
  typeUtilisateur: string = 'employes'; // 'employes' ou 'apprenants'
  selectedUtilisateur: any = null;
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUtilisateurs();
    this.listenToWebSocket();
  }

  // Récupérer la liste des utilisateurs
  fetchUtilisateurs(): void {
    this.loading = true;
    this.http
      .get<any[]>(`http://localhost:8002/api/${this.typeUtilisateur}`)
      .subscribe({
        next: (data) => {
          this.utilisateurs = data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la récupération des données.';
          console.error(err);
          this.loading = false;
        },
      });
  }

  // Changer le type d'utilisateur
  changeType(type: string): void {
    this.typeUtilisateur = type;
    this.fetchUtilisateurs();
  }

  // Sélectionner un utilisateur pour attribuer une carte
  selectUtilisateur(utilisateur: any): void {
    this.selectedUtilisateur = utilisateur;
    this.successMessage = `Prêt à scanner une carte pour ${utilisateur.nom} ${utilisateur.prenom}`;
    this.errorMessage = '';
  }

  // Écouter le WebSocket pour les scans de cartes RFID
  listenToWebSocket(): void {
    const ws = new WebSocket('ws://localhost:3003');
    ws.onmessage = (event) => {
      const scannedCard = event.data;
      console.log('Carte scannée:', scannedCard);

      if (this.selectedUtilisateur) {
        this.assignCard(scannedCard);
      } else {
        this.errorMessage = 'Veuillez sélectionner un utilisateur avant de scanner une carte.';
      }
    };
  }

  // Envoyer la carte scannée pour l'attribution
  assignCard(cardID: string): void {
    const payload = {
      uid: cardID,
      userType: this.typeUtilisateur,
      userId: this.selectedUtilisateur.id,
    };

    this.http.post('http://localhost:8002/api/assign-card', payload).subscribe({
      next: (response: any) => {
        this.successMessage = `Carte ${cardID} attribuée avec succès à ${this.selectedUtilisateur.nom} ${this.selectedUtilisateur.prenom}`;
        this.selectedUtilisateur = null; // Réinitialiser la sélection
        this.fetchUtilisateurs(); // Rafraîchir la liste
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'attribution de la carte.';
        console.error(err);
      },
    });
  }

}
