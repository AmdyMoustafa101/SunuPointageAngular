import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../../services/apprenant.service';
import { CommonModule } from '@angular/common';
import { Validators, FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { EmployeService } from '../../services/employe.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apprenant-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './apprenant-list.component.html',
  styleUrl: './apprenant-list.component.css'
})
export class ApprenantListComponent implements OnInit {
  apprenants: any[] = [];
  cohortes: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  search: string = '';
  selectedCohorte: number = 0;
  updateForm!: FormGroup;
  selectedApprenant: any;
  showModal: boolean = false;

  constructor(private apprenantService: ApprenantService, private http: HttpClient, private employeService: EmployeService,private fb: FormBuilder) {}

  ngOnInit() {
    this.getCohortes();
    this.getApprenants();

    this.updateForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: [''],
      telephone: [''],
      cohorte_id: [null],
    });

  }

  // openUpdateModal(apprenant: any): void {
  //   this.selectedApprenant = apprenant;
  //   this.updateForm.patchValue(apprenant);
  //   this.showModal = true;
  // }

  closeUpdateModal(): void {
    this.showModal = false;
    this.selectedApprenant = null;
  }



  // Récupérer les apprenants
  getApprenants() {
    this.apprenantService.getApprenants(this.currentPage, this.search, this.selectedCohorte).subscribe((data) => {
      this.apprenants = data.data;
      this.totalPages = data.last_page;
    });
  }



  // Récupérer les cohortes pour filtrage
  getCohortes() {
    this.apprenantService.getCohortes().subscribe((data) => {
      this.cohortes = data;
    });
  }

  openUpdateModal(apprenant: any): void {
    this.showModal = apprenant;
    this.updateForm.patchValue({
      nom: apprenant.nom,
      prenom: apprenant.prenom,
      adresse: apprenant.adresse,
      telephone: apprenant.telephone,
      cohorte_id: apprenant.cohorte?.id || null,

    });
    this.showModal = true;
  }

  onUpdateApprenant(): void {
    if (this.selectedApprenant && this.updateForm.valid) {
      const updatedData = this.updateForm.value;

      this.apprenantService.updateApprenant(this.selectedApprenant.id, updatedData).subscribe({
        next: (response) => {
          // Mettre à jour la liste localement
          const index = this.apprenants.findIndex(a => a.id === this.selectedApprenant.id);
          if (index > -1) {
            this.apprenants[index] = response;
          }

          Swal.fire('Succès', 'Apprenant mis à jour avec succès', 'success');
          this.selectedApprenant = null; // Réinitialiser après mise à jour
          this.closeUpdateModal();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
          Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour.', 'error');
        },
      });
    }
  }

  // Méthode pour télécharger le fichier CSV
  downloadCSV() {
    this.http.get('http://localhost:8002/api/apprenants/export/csv', { responseType: 'blob' }).subscribe({
      next: (blob) => {
        // Créer un lien pour télécharger le fichier CSV
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'apprenants.csv'; // Nom du fichier
        link.click();
        window.URL.revokeObjectURL(url);

        // Enregistrer l'action dans MongoDB
        this.employeService.enregistrerAction('Téléchargement CSV', 'apprenants').subscribe({
          next: () => console.log('Action de téléchargement CSV enregistrée avec succès'),
          error: (err) => console.error('Erreur lors de l’enregistrement de l’action:', err),
        });
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement CSV:', err);
        Swal.fire('Erreur', 'Impossible de télécharger le fichier CSV.', 'error');
      },
    });
  }


  // Méthode pour télécharger le fichier Excel
  ddownloadExcel() {
    // Effectuer le téléchargement Excel via redirection
    window.location.href = 'http://localhost:8002/api/apprenants/export/excel';

    // Enregistrer l'action dans MongoDB
    this.employeService.enregistrerAction('Téléchargement Excel', 'apprenants').subscribe({
      next: () => console.log('Action de téléchargement Excel enregistrée avec succès'),
      error: (err) => console.error('Erreur lors de l’enregistrement de l’action:', err),
    });
  }

  // Filtrer par cohorte
  onCohorteChange() {
    this.getApprenants();
  }

  // Rechercher par nom, prénom ou adresse
  onSearchChange() {
    this.getApprenants();
  }

  // Changer de page
  changePage(page: number) {
    this.currentPage = page;
    this.getApprenants();
  }
}
