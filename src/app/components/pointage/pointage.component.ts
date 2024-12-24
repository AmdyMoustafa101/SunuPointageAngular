import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PointageService } from '../../services/pointage.service';
import { HeaderAndSidebarComponent } from "../header-and-sidebar/header-and-sidebar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-pointage',
  templateUrl: './pointage.component.html',
  styleUrls: ['./pointage.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule, HeaderAndSidebarComponent],
})
export class PointageComponent implements OnInit {
  public users: any[] = []; // Liste des employés/apprenants
  public pointages: any[] = []; // Pointages enregistrés pour la date sélectionnée
  public selectedDate: string = ''; // Date sélectionnée
  public maxDate: string = new Date().toISOString().split('T')[0]; // Date maximale (aujourd'hui)
  public searchQuery: string = ''; // Texte de recherche
  public filteredUsers: any[] = []; // Liste filtrée pour l'affichage
  // Pagination properties
  public paginatedUsers: any[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public totalPages: number = 1;
  public pages: number[] = [];

  constructor(private pointageService: PointageService, private http: HttpClient) {}

  ngOnInit(): void {
    this.selectedDate = this.maxDate; // Par défaut : aujourd'hui
    this.loadUsers('employe'); // Charger les employés par défaut
    this.loadPointages(); // Charger les pointages pour la date sélectionnée
  }

  isSidebarVisible: boolean = true; // Par défaut, le sidebar est visible.

  // Exemple d'intégration avec une communication entre composants
  toggleSidebar(state: boolean): void {
    this.isSidebarVisible = state;
  }

  onDateChange(): void {
    this.loadPointages(); // Recharger les pointages lorsqu'une nouvelle date est sélectionnée
  }

  loadUsers(role: string): void {
    const url = role === 'employe'
      ? 'http://localhost:8002/api/employes'
      : 'http://localhost:8002/api/apprenants';

    this.http.get<any[]>(url).subscribe((data) => {
      this.filteredUsers = [...this.users]; // Initialiser la liste filtrée
      this.users = data;
      this.updatePagination();
    });
  }
  // Filtrer les utilisateurs selon le texte de recherche
  filterUsers(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.nom.toLowerCase().includes(query) ||
      user.prenom.toLowerCase().includes(query) ||
      user.matricule.toLowerCase().includes(query) ||
      (user.telephone && user.telephone.toLowerCase().includes(query))
    );
    this.updatePagination();
  }
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.changePage(1); // Réinitialiser à la première page
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  loadPointages(): void {
    this.pointageService.getPointages(this.selectedDate).subscribe((data) => {
      this.pointages = data; // Charger les pointages pour la date sélectionnée
    });
  }
  // Conversion de la date sélectionnée au format YYYY-MM-DD
convertDateToString(selectedDate: string | Date): string {
  const date = new Date(selectedDate);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Utilisation


  pointer(user: any, type: string): void {
    const connectedUser = this.getUserFromLocalStorage();


    // Formatage de la date (YYYY-MM-DD)
    const formattedDate = this.convertDateToString(this.selectedDate);

    // Récupérer l'heure actuelle (HH:mm)
    const now = new Date();
    const formattedTime = now.toISOString().split('T')[1].slice(0, 5);

    const pointageData = {
      utilisateur_id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      matricule: user.matricule,
      role: user.role || 'apprenant',
      date: formattedDate,
      heure_arrivee: type === 'arrivee' ? formattedTime : null,
      heure_depart: type === 'depart' ? formattedTime: null,
      vigile_matricule: connectedUser.matricule,
      vigile_prenom: connectedUser.prenom,
    };

    this.pointageService.enregistrerPointage(pointageData).subscribe(() => {
      // Swal de succès
      Swal.fire({
        icon: 'success',
        title: 'Pointage réussi !',
        html:
          `<p><strong>Matricule :</strong> ${user.matricule}</p>
          <p><strong>Nom :</strong> ${user.nom}</p>
          <p><strong>Prénom :</strong> ${user.prenom}</p>
          <p><strong>Rôle :</strong> ${user.role || 'Apprenant'}</p>
          <p><strong>Type :</strong> ${type === 'arrivee' ? 'Arrivée' : 'Départ'}</p>
          <p><strong>Date :</strong> ${formattedDate}</p>
          <p><strong>Heure :</strong> ${formattedTime}</p>
        `,
        confirmButtonText: 'OK',
      });
      this.loadPointages(); // Recharger les pointages après l'enregistrement
    });
  }

  isActionDisabled(user: any, actionType: string): boolean {
    return this.pointages.some(
      (pointage) =>
        pointage.nom === user.nom &&
        pointage.prenom === user.prenom &&
        pointage[actionType]
    );
  }

  getUserFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
