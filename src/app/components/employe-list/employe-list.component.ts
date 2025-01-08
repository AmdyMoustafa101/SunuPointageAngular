import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup , Validators, ReactiveFormsModule} from '@angular/forms';
import { EmployeService } from '../../services/employe.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employe-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employe-list.component.html',
  styleUrl: './employe-list.component.css'
})
export class EmployeListComponent {
  employes: any[] = [];
  departements: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  search: string = '';
  updateForm!: FormGroup;
  selectedEmploye: any;
  showModal: boolean = false;

  selectedDepartement: string = '';

  constructor(private employeService: EmployeService, private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadDepartements();
    //this.loadEmployes();
    this.loadEmployes();
    this.loadDepartements();

    this.updateForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: [''],
      telephone: [''],
      fonction: [''],
      departement_id: [null],
      email: ['', [Validators.email]],
    });
    this.searchEmployes();
  }

  // loadDepartements(): void {
  //   this.employeService.getDepartements().subscribe({
  //     next: (data) => {
  //       this.departements = data;
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors du chargement des départements:', err);
  //     },
  //   });
  // }

  // loadEmployes(): void {
  //   this.employeService
  //     .getEmployes(this.currentPage, this.search, this.selectedDepartement)
  //     .subscribe({
  //       next: (data) => {
  //         this.employes = data.data;
  //         this.currentPage = data.current_page;
  //         this.totalPages = data.last_page;
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors du chargement des employés:', err);
  //       },
  //     });
  // }

  loadEmployes(page: number = 1, search: string = ''): void {
    const params = {
      page: page.toString(), // Numéro de la page
      search: search.trim(), // Texte de recherche
    };
    this.employeService.getEmployes(params).subscribe((data) => {
      this.employes = data.data; // Assurez-vous que `data.data` est correct pour votre API
    });
  }


  loadDepartements(): void {
    this.employeService.getDepartements().subscribe((data) => {
      this.departements = data;
    });
  }

  openUpdateModal(employe: any): void {
    this.selectedEmploye = employe;
    this.updateForm.patchValue({
      nom: employe.nom,
      prenom: employe.prenom,
      adresse: employe.adresse,
      telephone: employe.telephone,
      fonction: employe.fonction,
      departement_id: employe.departement?.id || null,
      email: employe.email,
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onUpdateEmploye(): void {
    if (this.selectedEmploye && this.updateForm.valid) {
      const updatedData = this.updateForm.value;

      this.employeService.updateEmploye1(this.selectedEmploye.id, updatedData).subscribe({
        next: (response) => {
          // Mettre à jour localement l'employé dans la liste
          const index = this.employes.findIndex(emp => emp.id === this.selectedEmploye!.id);
          if (index > -1) {
            this.employes[index] = response;
          }

          Swal.fire('Succès', 'Employé mis à jour avec succès', 'success');
          this.selectedEmploye = null; // Réinitialiser après mise à jour
          this.showModal = false; // Fermer le modal
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
          Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour.', 'error');
        },
      });
    }
  }

  searchEmployes(): void {
    // Préparer les paramètres de recherche
    const params: any = {
      search: this.search || '',
      departement_id: this.selectedDepartement || '',
      page: this.currentPage,
    };

    this.employeService.getEmployes(params).subscribe({
      next: (response) => {
        this.employes = response.data;
        this.totalPages = response.last_page;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des employés :', error);
      },
    });
  }


  changePage(page: number): void {
    this.currentPage = page;
    //this.loadEmployes();
  }

  // Méthode pour télécharger le fichier CSV
  downloadCSV() {
    this.http.get('http://localhost:8002/api/employes/export/csv', { responseType: 'blob' }).subscribe({
      next: (blob) => {
        // Créer un lien pour télécharger le fichier CSV
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'employes.csv'; // Nom du fichier
        link.click();
        window.URL.revokeObjectURL(url);

        // Enregistrer l'action dans MongoDB
        this.employeService.enregistrerAction('Téléchargement CSV', 'employes').subscribe({
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
    window.location.href = 'http://localhost:8002/api/employes/export/excel';

    // Enregistrer l'action dans MongoDB
    this.employeService.enregistrerAction('Téléchargement Excel', 'employes').subscribe({
      next: () => console.log('Action de téléchargement Excel enregistrée avec succès'),
      error: (err) => console.error('Erreur lors de l’enregistrement de l’action:', err),
    });
  }



}
