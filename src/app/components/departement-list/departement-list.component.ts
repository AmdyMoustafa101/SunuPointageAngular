import { Component, OnInit } from '@angular/core';
import { DepartementService } from '../../services/departement.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Departement } from '../../models/departement.model';
import Swal from 'sweetalert2';
import { ConfirmationModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-departements',
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
  templateUrl: './departement-list.component.html',
  styleUrls: ['./departement-list.component.css']
})
export class DepartementListComponent implements OnInit {

  departements: Departement[] = [];
  errorMessage: string = '';
  departementForm: FormGroup;
  searchText: string = '';
  selectAll: boolean = false;
  viewType: string = 'active'; // 'active' ou 'archived'
  
  page: number = 1;
  itemsPerPage: number = 6;

  showConfirmationModal: boolean = false;
  confirmationMessage: string = '';
  actionToConfirm: () => void = () => {};
totalEmployesActifs: any;
totalEmployesArchives: any;

  constructor(private departementService: DepartementService, private router: Router, private fb: FormBuilder) {
    // Initialisation du formulaire de departement
    this.departementForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      horaires: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadDepartements();
  }

  // Chargement des départements depuis le service
  loadDepartements(): void {
    this.departementService.getDepartements().subscribe(
      (data: Departement[]) => {
        const sortedData = data.reverse();
        this.departements = sortedData.map(departement => ({
          ...departement,
          heure_debut: departement.horaires[0]?.heure_debut || 'Non défini',
          heure_fin: departement.horaires[0]?.heure_fin || 'Non défini',
        }));
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des départements : ' + error.message;
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
    this.confirmationMessage = 'Êtes-vous sûr de vouloir archiver ce département ?';
    this.actionToConfirm = () => this.archiveDepartement(id);
    this.showConfirmationModal = true;
  }

  openUnarchiveModal(id: number): void {
    this.confirmationMessage = 'Êtes-vous sûr de vouloir désarchiver ce département ?';
    this.actionToConfirm = () => this.unarchiveDepartement(id);
    this.showConfirmationModal = true;
  }

  // Sélectionner ou désélectionner tous les départements
  toggleSelectAll(): void {
    this.departements.forEach(departement => {
      departement.selected = this.selectAll;
    });
  }

  // Vérifier si un département est sélectionné
  isAnySelected(): boolean {
    return this.departements.some(departement => departement.selected);
  }

  // Sélectionner ou désélectionner un département spécifique
  toggleSelectDepartement(departementId: number): void {
    const departement = this.departements.find(d => d.id === departementId);
    if (departement) {
      departement.selected = !departement.selected;
    }
  }

  // Archiver les départements sélectionnés
  archiveSelectedDepartements(): void {
    const selectedIds: number[] = this.departements
      .filter(departement => departement.selected)
      .map(departement => departement.id)
      .filter((id): id is number => id !== undefined); // Filter out undefined values

    if (selectedIds.length === 0) {
      return;
    }

    this.confirmationMessage = `Êtes-vous sûr de vouloir archiver ${selectedIds.length} département(s) ?`;
    this.actionToConfirm = () => {
      this.departementService.archiveMultipleDepartements(selectedIds).subscribe(
        () => {
          Swal.fire('Succès', 'Départements archivés avec succès', 'success');
          this.selectAll = false;
          this.loadDepartements();
        },
        (error) => {
          Swal.fire('Erreur', 'Erreur lors de l\'archivage des départements', 'error');
          console.error(error);
        }
      );
    };
    this.showConfirmationModal = true;
  }

  // Déarchiver les départements sélectionnés
  unarchiveSelectedDepartements(): void {
    const selectedIds: number[] = this.departements
      .filter(departement => departement.selected)
      .map(departement => departement.id)
      .filter((id): id is number => id !== undefined); // Filter out undefined values

    if (selectedIds.length === 0) {
      return;
    }

    this.confirmationMessage = `Êtes-vous sûr de vouloir déarchiver ${selectedIds.length} département(s) ?`;
    this.actionToConfirm = () => {
      this.departementService.unarchiveMultipleDepartements(selectedIds).subscribe(
        () => {
          Swal.fire('Succès', 'Départements déarchivés avec succès', 'success');
          this.selectAll = false;
          this.loadDepartements();
        },
        (error) => {
          this.errorMessage = 'Erreur lors du déarchivage des départements : ' + error.message;
          console.error(error);
        }
      );
    };
    this.showConfirmationModal = true;
  }

  // Afficher les détails d'un département
  viewDepartement(id: number): void {
    this.router.navigate(['/departement', id ?? 0]);
  }

  // Editer un département
  editDepartement(id: number): void {
    this.router.navigate(['/departement/edit', id ?? 0]);
  }

  // Archiver un département
  archiveDepartement(id: number): void {
    this.departementService.archiveDepartement(id ?? 0).subscribe(
      () => {
        Swal.fire('Succès', 'Département archivé avec succès', 'success');
        this.loadDepartements();
      },
      (error) => {
        Swal.fire('Erreur', 'Erreur lors de l\'archivage du département', 'error');
        console.error(error);
      }
    );
  }

  // Désarchiver un département
  unarchiveDepartement(id: number): void {
    this.departementService.unarchiveDepartement(id ?? 0).subscribe(
      () => {
        Swal.fire('Succès', 'Département désarchivé avec succès', 'success');
        this.loadDepartements();
      },
      (error) => {
        Swal.fire('Erreur', 'Erreur lors du désarchivage du département', 'error');
        console.error(error);
      }
    );
  }

  // Filtrer les départements par type et texte de recherche
  filterDepartements(): Departement[] {
    let filteredDepartements = this.departements.filter(departement => 
      this.viewType === 'active' ? !departement.archive : departement.archive
    );

    if (this.searchText.trim()) {
      filteredDepartements = filteredDepartements.filter(departement => 
        departement.nom.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    return filteredDepartements;
  }

  // Soumettre le formulaire de département
  onSubmit(): void {
    if (this.departementForm.valid) {
      console.log(this.departementForm.value);
      this.departementForm.reset();
    }
  }

  // Obtenir les horaires du formulaire
  get horaires(): FormArray {
    return this.departementForm.get('horaires') as FormArray;
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

  // Exporter les départements en CSV
  exportToCsv(): void {
    const csvData = this.convertToCsv(this.departements);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'departements.csv';
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