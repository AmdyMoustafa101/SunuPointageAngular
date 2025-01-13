import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderAndSidebarComponent } from "../header-and-sidebar/header-and-sidebar.component";
import { SideNavComponent } from "../side-nav/side-nav.component";

@Component({
  selector: 'app-presence',
  standalone: true,
  imports: [FormsModule, CommonModule, SideNavComponent],
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.css'],
})
export class PresenceComponent {
  selectedDate: string = '';
  presences: any[] = [];
  filteredPresences: any[] = [];
  searchQuery: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les données selon le rôle
  getPresences(role: string) {
    if (!this.selectedDate) return;

    this.loading = true;
    this.error = '';
    const url = `http://localhost:3005/api/presences?date=${this.selectedDate}&role=${role}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.presences = data;
        this.filteredPresences = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la récupération des données.';
        this.loading = false;
        console.error(err);
      },
    });
  }
  isSidebarVisible: boolean = true; // Par défaut, le sidebar est visible.

  // Exemple d'intégration avec une communication entre composants
  toggleSidebar(state: boolean): void {
    this.isSidebarVisible = state;
  }

  // Méthode appelée quand une date est sélectionnée
  onDateChange() {
    this.getPresences('apprenant'); // Récupérer les apprenants par défaut
  }

  // Méthode pour filtrer les données localement
  filterPresences() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPresences = this.presences.filter((presence) =>
      presence.nom.toLowerCase().includes(query) ||
      presence.prenom.toLowerCase().includes(query) ||
      presence.nomDepartementOuCohorte.toLowerCase().includes(query)
    );
  }
}
