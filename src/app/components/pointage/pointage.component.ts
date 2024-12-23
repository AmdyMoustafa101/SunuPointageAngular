import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderAndSidebarComponent } from "../header-and-sidebar/header-and-sidebar.component";
import { PointageService } from '../../services/pointage.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pointage',
  standalone: true,
  imports: [FormsModule,CommonModule, HeaderAndSidebarComponent],
  templateUrl: './pointage.component.html',
  styleUrl: './pointage.component.css'
})
export class PointageComponent implements OnInit {
  public users: any[] = []; // Liste des utilisateurs (employés ou apprenants)
  public role: string = ''; // Le rôle de l'utilisateur connecté

  constructor(private pointageService: PointageService, private http: HttpClient) {}

  ngOnInit(): void {
    // Charger les utilisateurs à partir de l'API (employés ou apprenants)
    this.loadUsers('employe'); // Charger par défaut les employés
  }

  isSidebarVisible: boolean = true; // Par défaut, le sidebar est visible.

  // Exemple d'intégration avec une communication entre composants
  toggleSidebar(state: boolean): void {
    this.isSidebarVisible = state;
  }

  loadUsers(role: string) {
    // Mettez à jour l'URL en fonction du rôle
    const url =
      role === 'employe'
        ? 'http://localhost:8002/api/employes'
        : 'http://localhost:8002/api/apprenants';

    this.http.get<any[]>(url).subscribe((data) => {
      this.users = data; // Assigner les données récupérées à la variable 'users'
    });
  }

  pointer(user: any, type: string) {
    // Récupérer les informations de l'utilisateur connecté depuis le localStorage
    const connectedUser = this.getUserFromLocalStorage();

    const pointageData = {
      utilisateur_id: user.id, // ID de l'utilisateur à pointer
      nom: user.nom,
      prenom: user.prenom,
      role: user.role || 'apprenant',
      date: new Date(),
      heure_arrivee: type === 'arrivee' ? new Date() : null,
      heure_depart: type === 'depart' ? new Date() : null,
      vigile_matricule: connectedUser.matricule, // Matricule de l'employé connecté
      vigile_prenom: connectedUser.prenom, // Prénom de l'employé connecté
    };

    // Envoyer les données de pointage au backend
    this.pointageService.enregistrerPointage(pointageData).subscribe(
      (response) => {
        console.log('Pointage enregistré avec succès', response);
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement du pointage', error);
      }
    );
  }

  getUserFromLocalStorage() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
