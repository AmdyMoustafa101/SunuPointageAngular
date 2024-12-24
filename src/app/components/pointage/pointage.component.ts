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
      this.users = data;
    });
  }

  loadPointages(): void {
    this.pointageService.getPointages(this.selectedDate).subscribe((data) => {
      this.pointages = data; // Charger les pointages pour la date sélectionnée
    });
  }

  pointer(user: any, type: string): void {
    const connectedUser = this.getUserFromLocalStorage();

    const pointageData = {
      utilisateur_id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role || 'apprenant',
      date: this.selectedDate,
      heure_arrivee: type === 'arrivee' ? new Date() : null,
      heure_depart: type === 'depart' ? new Date() : null,
      vigile_matricule: connectedUser.matricule,
      vigile_prenom: connectedUser.prenom,
    };

    this.pointageService.enregistrerPointage(pointageData).subscribe(() => {
      // Swal de succès
      Swal.fire({
        icon: 'success',
        title: 'Pointage réussi !',
        html: `
          <p><strong>Nom :</strong> ${user.nom}</p>
          <p><strong>Prénom :</strong> ${user.prenom}</p>
          <p><strong>Rôle :</strong> ${user.role || 'Apprenant'}</p>
          <p><strong>Type :</strong> ${type === 'arrivee' ? 'Arrivée' : 'Départ'}</p>
          <p><strong>Date :</strong> ${this.selectedDate}</p>
          <p><strong>Heure :</strong> ${new Date().toLocaleTimeString()}</p>
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
