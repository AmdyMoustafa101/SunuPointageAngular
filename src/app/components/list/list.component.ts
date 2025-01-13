import { Component } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { SideNavComponent } from '../side-nav/side-nav.component';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SideNavComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  Math = Math;
  utilisateurs: any[] = [];
  filteredUtilisateurs: any[] = [];
  typeUtilisateur: string = 'employes'; // 'employes' ou 'apprenants'
  selectedUtilisateur: any = null;
  loading: boolean = false;

  // Variables pour la recherche
  searchTerm: string = '';

  // Variables pour la pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

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
          this.applySearchFilter();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la récupération des données.',
          });
          console.error(err);
        },
      });
  }

  // Filtrer les utilisateurs en fonction de la recherche
  applySearchFilter(): void {
    this.filteredUtilisateurs = this.utilisateurs.filter((utilisateur) => {
      const search = this.searchTerm.toLowerCase();
      return (
        utilisateur.nom.toLowerCase().includes(search) ||
        utilisateur.prenom.toLowerCase().includes(search) ||
        utilisateur.matricule.toLowerCase().includes(search)
      );
    });
  }

  // Gérer les changements de recherche
  onSearchChange(): void {
    this.applySearchFilter();
    this.currentPage = 1; // Réinitialiser la pagination à la première page
  }

  // Changer le type d'utilisateur
  changeType(type: string): void {
    this.typeUtilisateur = type;
    this.searchTerm = '';
    this.currentPage = 1;
    this.fetchUtilisateurs();
  }

  // Obtenir les utilisateurs pour la page actuelle
  getPagedUtilisateurs(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUtilisateurs.slice(start, end);
  }

  // Changer de page
  changePage(page: number): void {
    this.currentPage = page;
  }

  // Sélectionner un utilisateur pour attribuer une carte
  selectUtilisateur(utilisateur: any): void {
    this.selectedUtilisateur = utilisateur;
    Swal.fire({
      icon: 'info',
      title: 'Prêt à scanner',
      text: `Prêt à scanner une carte pour ${utilisateur.nom} ${utilisateur.prenom}`,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  // Écouter le WebSocket pour les scans de cartes RFID
  listenToWebSocket(): void {
    const ws = new WebSocket('ws://localhost:3004');
    ws.onmessage = (event) => {
      const scannedCard = event.data;
      console.log('Carte scannée:', scannedCard);

      if (this.selectedUtilisateur) {
        this.assignCard(scannedCard);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Alerte',
          text: 'Veuillez sélectionner un utilisateur avant de scanner une carte.',
        });
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
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: `Carte ${cardID} attribuée avec succès à ${this.selectedUtilisateur.nom} ${this.selectedUtilisateur.prenom}`,
        });
        this.selectedUtilisateur = null; // Réinitialiser la sélection
        this.fetchUtilisateurs(); // Rafraîchir la liste
      },
      error: (err) => {
        let message = 'Erreur lors de l\'attribution de la carte.';
        if (err.status === 400) {
          message = err.error.message || 'Cette carte est déjà attribuée.';
        } else if (err.status === 404) {
          message = err.error.message || 'Utilisateur non trouvé.';
        }
        Swal.fire({
          icon: 'error',
          title: 'Échec',
          text: message,
        });
        console.error(err);
      },
    });
  }

  unassignCard(utilisateur: any): void {
    const payload = {
      userType: this.typeUtilisateur,
      userId: utilisateur.id,
    };

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `La carte attribuée à ${utilisateur.nom} ${utilisateur.prenom} sera supprimée.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, désattribuer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post('http://localhost:8002/api/unassign-card', payload).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: `La carte a été désattribuée pour ${utilisateur.nom} ${utilisateur.prenom}.`,
            });
            this.fetchUtilisateurs(); // Rafraîchir la liste
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Échec',
              text: 'Erreur lors de la désattribution de la carte.',
            });
            console.error(err);
          },
        });
      }
    });
  }



}
