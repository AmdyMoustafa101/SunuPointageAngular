import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApprenantService } from '../../services/apprenant.service';
import { CommonModule } from '@angular/common';
import { CohorteService } from '../../services/cohorte.service'; 
import { HttpErrorResponse } from '@angular/common/http';
import { Cohorte } from '../../models/cohorte.model';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';

@Component({
  selector: 'app-liste-apprenants',
  standalone: true,
  imports: [CommonModule, HeaderAndSidebarComponent, FormsModule],
  templateUrl: './liste-apprenant.component.html',
  styleUrls: ['./liste-apprenant.component.css']
})
export class ListeApprenantsComponent implements OnInit {
  apprenants: any[] = [];
  id: number | null = null;  
  cohorte: Cohorte | null = null;
  errorMessage: string = '';
  filterText: string = '';
  filteredApprenants: any[] = [];
  selectedApprenants: number[] = [];
  

  constructor(
    private router: Router,
    private apprenantService: ApprenantService,
    private route: ActivatedRoute,
    private cohorteService: CohorteService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idString = params.get('id');  

      console.log('Paramètre id récupéré:', idString);  

      if (idString === null) {
        console.error('ID de la cohorte manquant dans l\'URL');
        return;
      }

      this.id = +idString;

      if (isNaN(this.id)) {
        console.error('ID de la cohorte invalide:', this.id);
        return;
      }

      this.loadApprenants();
      this.loadCohorte();
    });
  }

  loadApprenants() {
    if (this.id === null) {
      console.error('ID de la cohorte est null');
      return;
    }
  
    console.log('Chargement des apprenants pour la cohorte ID:', this.id);
  
    this.apprenantService.getApprenantsByCohorte(this.id).subscribe(
      (data) => {
        console.log('Apprenants récupérés:', data);
        // Filtrer les apprenants pour exclure ceux qui sont archivés
        this.apprenants = data.filter(apprenant => !apprenant.archivé);
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des apprenants:', error.message);
        this.errorMessage = 'Une erreur est survenue lors du chargement des apprenants.';
      }
    );
  }
  

  loadCohorte(): void {
    if (this.id !== null) {
        this.cohorteService.getCohorteById(this.id).subscribe(
            (data: Cohorte) => {
                this.cohorte = data; 
            },
            (error) => {
                console.error('Erreur lors du chargement de la cohorte:', error);
            }
        );
    }
  }


  
  voirDetails(id: number): void {
    console.log(`Voir les détails de l'apprenant avec l'ID : ${id}`);
    this.router.navigate(['/apprenant', id]); 
  }

  modifierApprenant(id: number): void {
    console.log(`Modifier l'apprenant avec l'ID : ${id}`);
    this.router.navigate(['/update-apprenant', id]);
  }

  archiverApprenant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir archiver cet apprenant ?')) {
      this.apprenantService.archiverApprenant(id).subscribe({
        next: () => {
          this.loadApprenants(); // Recharge la liste
          alert('Apprenant archivé avec succès.');
        },
        error: (error) => {
          console.error('Erreur lors de l\'archivage de l\'apprenant:', error);
          alert('Erreur lors de l\'archivage de l\'apprenant.');
        }
      });
    }
  }

  // Méthode pour archiver plusieurs apprenants
  archiveSelectedApprenants(): void {
    const selectedApprenants = this.apprenants.filter(apprenant => apprenant.selected);
  
    if (selectedApprenants.length === 0) {
      // Si aucun apprenant n'est sélectionné, afficher un message ou effectuer une action
      console.log('Aucun apprenant sélectionné.');
      return; // Arrêter l'exécution si aucune sélection
    }
  
    // Traitez les apprenants sélectionnés (par exemple, les archiver)
    selectedApprenants.forEach(apprenant => {
      // Logique pour archiver l'apprenant
      console.log(`Archivage de l'apprenant ${apprenant.matricule}`);
    });
  }
  

  supprimerApprenants(): void {
    const selectedApprenants = this.apprenants.filter(apprenant => apprenant.selected);
    
    if (selectedApprenants.length === 0) {
      alert('Veuillez sélectionner au moins un apprenant à supprimer.');
      return;
    }
  
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedApprenants.length} apprenant(s) ?`)) {
      const ids = selectedApprenants.map(apprenant => apprenant.id);
      
      this.apprenantService.supprimerApprenants(ids).subscribe({
        next: () => {
          this.loadApprenants(); // Recharge la liste
          alert('Les apprenants ont été supprimés avec succès.');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur lors de la suppression des apprenants:', error);
          alert('Une erreur est survenue lors de la suppression des apprenants.');
        }
      });
    }
  }
  

  ajouterApprenant(): void {
    console.log('Ajouter un nouvel apprenant');
    this.router.navigate(['/apprenants']); // Cela devrait fonctionner si la route est correcte
}



isAllSelected(): boolean {
  return this.apprenants.every(apprenant => apprenant.selected); // Vérifie si tous les apprenants sont sélectionnés
}


  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.apprenants.forEach(apprenant => {
      apprenant.selected = isChecked; // Marquer tous les apprenants comme sélectionnés/désélectionnés
    });
  }
  

  hasSelected(): boolean {
    return this.apprenants.some(apprenant => apprenant.selected); // Vérifie s'il y a au moins un apprenant sélectionné
  }
  

  


  // filterApprenants() {
  //   if (!this.filterText) {
  //     this.filteredApprenants = this.apprenants; // Réinitialiser si aucun texte de filtrage
  //     return;
  //   }

  //   const lowerCaseFilterText = this.filterText.toLowerCase();
  //   this.filteredApprenants = this.apprenants.filter(apprenant => 
  //     apprenant.nom.toLowerCase().includes(lowerCaseFilterText) ||
  //     apprenant.prenom.toLowerCase().includes(lowerCaseFilterText) ||
  //     apprenant.matricule.toLowerCase().includes(lowerCaseFilterText) ||
  //     apprenant.telephone.toLowerCase().includes(lowerCaseFilterText)
  //   );
  // }
}