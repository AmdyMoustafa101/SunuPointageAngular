import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute } from '@angular/router';
import { ApprenantService } from '../../services/apprenant.service';
import { CommonModule } from '@angular/common';
import { CohorteService } from '../../services/cohorte.service'; 
import { HttpErrorResponse } from '@angular/common/http';
import { Apprenant } from '../../models/apprenant.model';
import { Cohorte } from '../../models/cohorte.model';
import { SideNavComponent } from '../side-nav/side-nav.component';
import Swal from 'sweetalert2';
import { ConfirmationModalComponent } from '../modal/modal.component';



@Component({
  selector: 'app-liste-apprenants',
  standalone: true,
  imports: [CommonModule, SideNavComponent, FormsModule, NgxPaginationModule, ConfirmationModalComponent],
  templateUrl: './liste-apprenant.component.html',
  styleUrls: ['./liste-apprenant.component.css']
})
export class ListeApprenantsComponent implements OnInit {
  apprenants: any[] = [];
  id: number | null = null;  
  cohorte: Cohorte | null = null;
  errorMessage: string = '';
  searchTerm: string = '';
  filterText: string = '';
  filteredApprenants: any[] = [];
  selectedApprenants: number[] = [];
  filter: string = 'actifs';
  showActive: boolean = true;
  
  // Pagination properties
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  showArchived: boolean = false;


   // Modal properties
   showModal: boolean = false;
   modalMessage: string = '';
   currentAction: (() => void) | null = null;


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
      this.showActiveApprenants();
    });
  }

  // Fonction pour récupérer les apprenants actifs par cohorte
showActiveApprenants(): void {
  if (this.cohorte && this.cohorte.id !== null) {
      this.apprenantService.getApprenantsActifsByCohorte(this.cohorte.id).subscribe(
          (data: Apprenant[]) => {
              this.filteredApprenants = data;
              this.totalItems = data.length;
              this.page = 1; // Reset to the first page
              this.showActive = true; // Mise à jour de showActive à true
          },
          (error) => {
              console.error('Erreur lors de la récupération des apprenants actifs par cohorte:', error);
          }
      );
  }
}

// Fonction pour récupérer les apprenants archivés par cohorte
showArchivedApprenants(): void {
  if (this.cohorte && this.cohorte.id !== null) {
      this.apprenantService.getApprenantsArchivesByCohorte(this.cohorte.id).subscribe(
          (data: Apprenant[]) => {
              this.filteredApprenants = data;
              this.totalItems = data.length;
              this.page = 1; // Reset to the first page
              this.showActive = false; // Mise à jour de showActive à false
          },
          (error) => {
              console.error('Erreur lors de la récupération des apprenants archivés par cohorte:', error);
          }
      );
  }
}

  loadApprenants() {
    if (this.id === null) {
      console.error('ID de la cohorte est null');
      return;
    }

    console.log('Chargement des apprenants pour la cohorte ID:', this.id);

    this.apprenantService.getApprenantsByCohorte(this.id).subscribe(
      (data) => {
        console.log('Données reçues depuis l\'API :', data);
        this.apprenants = data.filter(apprenant => !apprenant.archivé);
        this.filteredApprenants = this.apprenants;
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
    this.modalMessage = 'Êtes-vous sûr de vouloir archiver cet apprenant ?';
    this.currentAction = () => {
        this.apprenantService.archiverApprenant(id).subscribe({
            next: () => {
                this.loadApprenants(); // Recharge la liste
                Swal.fire('Succès', 'Apprenant archivé avec succès.', 'success');
            },
            error: (error) => {
                console.error('Erreur lors de l\'archivage de l\'apprenant:', error);
                Swal.fire('Erreur', 'Erreur lors de l\'archivage de l\'apprenant.', 'error');
            }
        });
    };
    this.showModal = true;
  }

  desarchiverApprenant(id: number): void {
    this.modalMessage = 'Êtes-vous sûr de vouloir désarchiver cet apprenant ?';
    this.currentAction = () => {
        this.apprenantService.desarchiverApprenant(id).subscribe(
            (response) => {
                console.log('Apprenant désarchivé avec succès:', response);
                this.showArchivedApprenants(); // Rafraîchir la liste des apprenants archivés
                Swal.fire('Succès', 'Apprenant désarchivé avec succès.', 'success');
            },
            (error) => {
                console.error('Erreur lors de la désarchivation de l\'apprenant:', error);
                Swal.fire('Erreur', 'Erreur lors de la désarchivation de l\'apprenant.', 'error');
            }
        );
    };
    this.showModal = true;
  }


  // Méthode pour archiver plusieurs apprenants
  archiveSelectedApprenants() {
    const ids = this.filteredApprenants
      .filter(apprenant => apprenant.selected)
      .map(apprenant => apprenant.id);
    
    if (ids.length > 0) {
      this.apprenantService.archiverApprenants(ids).subscribe(
        (response) => {
          console.log('Apprenants archivés avec succès', response);
          Swal.fire('Succès', 'Apprenants archivés avec succès.', 'success');
          this.loadApprenants(); // Recharge la liste des apprenants
        },
        (error) => {
          Swal.fire('Erreur', 'Erreur lors de l\'archivage de l\'apprenant.', 'error');
          console.error('Erreur lors de l\'archivage des apprenants:', error);
        }
      );
    } else {
      console.error('Aucun apprenant sélectionné.');
    }
  }

 
  desarchiverSelectedApprenants(): void {
    const ids = this.filteredApprenants
      .filter(apprenant => apprenant.selected)
      .map(apprenant => apprenant.id);
    
    this.apprenantService.desarchiverApprenants(ids).subscribe(
      (response) => {
        Swal.fire('Succès', 'Apprenants désarchivés avec succès:', 'success');
        console.log('Apprenants désarchivés avec succès', response);
        this.showArchivedApprenants(); // Rafraîchir la liste des apprenants archivés
      },
      (error) => {
        Swal.fire('Erreur', 'Erreur lors de la désarchivation des apprenants', 'error');
        console.error('Erreur lors de la désarchivation des apprenants:', error);
      }
    );
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
    return this.apprenants.length > 0 && this.apprenants.every(a => a.selected);
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.filteredApprenants.forEach(apprenant => {
      apprenant.selected = isChecked; // Marquer tous les apprenants comme sélectionnés/désélectionnés
    });
  }

  hasSelected(): boolean {
    return this.filteredApprenants.some(apprenant => apprenant.selected);
  }

  onPageChange(page: number): void {
    this.page = page;
  }

  // Méthode pour obtenir les éléments de la page courante
  get paginatedApprenants(): Apprenant[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredApprenants.slice(startIndex, startIndex + this.itemsPerPage);
  }

  

  // Méthode de filtrage
  filterApprenants(): void {
    if (!this.searchTerm) {
        // Si le champ de recherche est vide, affichez tous les apprenants
        this.filteredApprenants = this.apprenants; // 'allApprenants' doit contenir tous les apprenants
    } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredApprenants = this.apprenants.filter(apprenant =>
            apprenant.nom.toLowerCase().includes(term) ||
            apprenant.prenom.toLowerCase().includes(term) ||
            apprenant.matricule.toLowerCase().includes(term) ||
            apprenant.telephone.toLowerCase().includes(term)
        );
    }
  }


  handleConfirm() {
    if (this.currentAction) {
      this.currentAction();
    }
    this.showModal = false;
  }
  
  handleClose() {
    this.showModal = false;
    this.currentAction = null;
  }
}