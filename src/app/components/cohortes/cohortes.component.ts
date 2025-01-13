import { Component, OnInit } from '@angular/core';
import { CohorteService } from '../../services/cohorte.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AddCohorteComponent } from '../add-cohorte/add-cohorte.component';
import { Cohorte, StatutCohorte } from '../../models/cohorte.model';
import { NgxPaginationModule } from 'ngx-pagination'; // Import NgxPaginationModule
import { ApprenantService } from '../../services/apprenant.service';
import Swal from 'sweetalert2';
import { ConfirmationModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-cohortes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SideNavComponent,
    RouterModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ConfirmationModalComponent,
],
  templateUrl: './cohortes.component.html',
  styleUrls: ['./cohortes.component.css']
})
export class CohortesComponent implements OnInit {

  cohortes: Cohorte[] = [];
  errorMessage: string = '';
  cohorteForm: FormGroup;
  searchText: string = '';
  selectAll: boolean = false;
  viewType: string = 'active'; // 'active' ou 'archived'
  
  statutCohorte = StatutCohorte;
  page: number = 1;
  itemsPerPage: number = 6;


  // Ajouter les propriétés manquantes
  totalApprenantsActifs: number = 0;
  totalApprenantsArchives: number = 0;


  showConfirmationModal: boolean = false;
  confirmationMessage: string = '';
  actionToConfirm: () => void = () => {};

  

  constructor(private cohortService: CohorteService, private apprenantService: ApprenantService, private router: Router, private fb: FormBuilder) {
    // Initialisation du formulaire de cohorte
    this.cohorteForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      annee: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      statut: [StatutCohorte.ACTIVE, Validators.required],
      horaires: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadCohortes();
    this.loadApprenantsStats();
  }

  // Chargement des cohortes depuis le service
  loadCohortes(): void {
    this.cohortService.getCohortes().subscribe(
      (data: Cohorte[]) => {
        const sortedData = data.reverse();
        this.cohortes = sortedData.map(cohorte => ({
          ...cohorte,
          heure_debut: cohorte.horaires[0]?.heure_debut || 'Non défini',
          heure_fin: cohorte.horaires[0]?.heure_fin || 'Non défini',
        }));
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des cohortes : ' + error.message;
        console.error(error);
      }
    );
  }


  // Charger les statistiques des apprenants
  loadApprenantsStats(): void {
    this.apprenantService.getApprenantsActifs().subscribe(
      (data) => {
        this.totalApprenantsActifs = data.length;
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des apprenants actifs : ' + error.message;
        console.error(error);
      }
    );

    this.apprenantService.getApprenantsArchives().subscribe(
      (data) => {
        this.totalApprenantsArchives = data.length;
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des apprenants archivés : ' + error.message;
        console.error(error);
      }
    );
  }

  // Définir le type de vue (active ou archived)
  setViewType(viewType: string): void {
    this.viewType = viewType;
  }

  isArchivedView(): boolean {
    return this.viewType === 'archived';
  }


  openArchiveModal(id: number): void {
    this.confirmationMessage = 'Êtes-vous sûr de vouloir archiver cette cohorte ?';
    this.actionToConfirm = () => this.archiveCohorte(id);
    this.showConfirmationModal = true;
  }

  openUnarchiveModal(id: number): void {
    this.confirmationMessage = 'Êtes-vous sûr de vouloir désarchiver cette cohorte ?';
    this.actionToConfirm = () => this.unarchiveCohorte(id);
    this.showConfirmationModal = true;
  }

 
  // Sélectionner ou désélectionner toutes les cohortes
  toggleSelectAll(): void {
    this.cohortes.forEach(cohorte => {
      cohorte.selected = this.selectAll;
    });
  }

  // Vérifier si une cohorte est sélectionnée
  isAnySelected(): boolean {
    return this.cohortes.some(cohorte => cohorte.selected);
  }

  // Sélectionner ou désélectionner une cohorte spécifique
  toggleSelectCohorte(cohorteId: number): void {
    const cohorte = this.cohortes.find(c => c.id === cohorteId);
    if (cohorte) {
      cohorte.selected = !cohorte.selected;
    }
  }

  // Archiver les cohortes sélectionnées
  archiveSelectedCohortes(): void {
    const selectedCohortes = this.cohortes.filter(cohorte => cohorte.selected);
    const selectedIds = selectedCohortes.map(cohorte => cohorte.id);

    if (selectedIds.length === 0) {
      return;
    }

    this.confirmationMessage = `Êtes-vous sûr de vouloir archiver ${selectedIds.length} cohorte(s) ?`;
    this.actionToConfirm = () => {
      this.cohortService.archiveMultipleCohortes(selectedIds).subscribe(
        () => {
          Swal.fire('Succès', 'Cohortes archivées avec succès', 'success');
          this.selectAll = false;
          this.loadCohortes();
        },
        (error) => {
          Swal.fire('Erreur', 'Erreur lors de l\'archivage des cohortes', 'error');
          console.error(error);
        }
      );
    };
    this.showConfirmationModal = true;
  }



   // Déarchiver les cohortes sélectionnées
   unarchiveSelectedCohortes(): void {
    const selectedCohortes = this.cohortes.filter(cohorte => cohorte.selected);
    const selectedIds = selectedCohortes.map(cohorte => cohorte.id);

    if (selectedIds.length === 0) {
      return;
    }

    this.confirmationMessage = `Êtes-vous sûr de vouloir déarchiver ${selectedIds.length} cohorte(s) ?`;
    this.actionToConfirm = () => {
      this.cohortService.unarchiveMultipleCohortes(selectedIds).subscribe(
        () => {
          console.log('Cohortes déarchivées avec succès');
          Swal.fire('Succès', 'Cohortes désarchivées avec succès','success');
          this.selectAll = false;
          this.loadCohortes();
        },
        (error) => {
          this.errorMessage = 'Erreur lors du déarchivage des cohortes : ' + error.message;
          console.error(error);
        }
      );
    };
    this.showConfirmationModal = true;
  }


  // Afficher les détails d'une cohorte
  viewCohorte(id: number): void {
    this.router.navigate(['/cohorte', id]);
  }

  // Editer une cohorte
  editCohorte(id: number): void {
    this.router.navigate(['/cohorte/edit', id]);
  }

   // Archiver une cohorte
   archiveCohorte(id: number): void {
    this.cohortService.archiveCohorte(id).subscribe(
      () => {
        Swal.fire('Succès', 'Cohorte archivée avec succès','success');
        this.loadCohortes();
      },
      (error) => {
        Swal.fire('Error', 'Erreur lors de l\'archivage de la cohorte', 'error');
        // this.errorMessage = 'Erreur lors de l\'archivage de la cohorte : ' + error.message;
        console.error(error);
      }
    );
  }

  // Désarchiver une cohorte
  unarchiveCohorte(id: number): void {
    this.cohortService.unarchiveCohorte(id).subscribe(
      () => {
        Swal.fire('Succès', 'Cohorte désarchivée avec succès','success');
        this.loadCohortes();
      },
      (error) => {
        Swal.fire('Erreur', 'Erreur lors du désarchivage de la cohorte', 'error');
        // this.errorMessage = 'Erreur lors du désarchivage de la cohorte : ' + error.message;
        console.error(error);
      }
    );
  }

  // Filtrer les cohortes par type et texte de recherche
  filterCohortes(): Cohorte[] {
    let filteredCohortes = this.cohortes.filter(cohorte => 
      this.viewType === 'active' ? !cohorte.archive : cohorte.archive
    );

    if (this.searchText.trim()) {
      filteredCohortes = filteredCohortes.filter(cohorte => 
        cohorte.nom.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    return filteredCohortes;
  }
  // Soumettre le formulaire de cohorte
  onSubmit(): void {
    if (this.cohorteForm.valid) {
      console.log(this.cohorteForm.value);
      this.cohorteForm.reset();
    }
  }

  // Obtenir les horaires du formulaire
  get horaires(): FormArray {
    return this.cohorteForm.get('horaires') as FormArray;
  }

  // Ajouter un horaire au formulaire
  addHoraire(): void {
    const horaireForm = this.fb.group({
      jours: this.fb.array([], Validators.required),
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required]
    });
    this.horaires.push(horaireForm);
  }

  // Retirer un horaire du formulaire
  removeHoraire(index: number): void {
    this.horaires.removeAt(index);
  }

  // Exporter les cohortes en CSV
  exportToCsv(): void {
    const csvData = this.convertToCsv(this.cohortes);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cohortes.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Convertir les données en CSV
  private convertToCsv(data: any[]): string {
    const headers = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return headers + rows;
  }

  onConfirmed(): void {
    this.actionToConfirm();
    this.showConfirmationModal = false;
  }

  onClosed(): void {
    this.showConfirmationModal = false;
  }
}