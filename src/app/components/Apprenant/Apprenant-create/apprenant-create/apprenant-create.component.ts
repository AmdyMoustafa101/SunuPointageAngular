import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApprenantService } from '../../../../services/apprenant.service';
import { CohorteService } from '../../../../services/cohorte.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { HeaderAndSidebarComponent } from "../../../header-and-sidebar/header-and-sidebar.component";

// Déclarez l'interface pour la cohorte
interface Cohorte {
  id: number;
  nom: string;
  annee: string;
}

@Component({
  selector: 'app-apprenant-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderAndSidebarComponent],
  templateUrl: './apprenant-create.component.html',
  styleUrl: './apprenant-create.component.css'
})
export class ApprenantCreateComponent implements OnInit {
  apprenantForm!: FormGroup;
  csvFile: File | null = null;
  cohortes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apprenantService: ApprenantService,
    private cohorteService: CohorteService
  ) { }

  ngOnInit(): void {
    this.apprenantForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      photo: [null],
      cohorte_id: ['', [Validators.required]],
    });

    this.cohorteService.getCohortes().subscribe(cohortes => {
      this.cohortes = cohortes;
    });
  }

  isSidebarVisible: boolean = true; // Par défaut, le sidebar est visible.

  // Exemple d'intégration avec une communication entre composants
  toggleSidebar(state: boolean): void {
    this.isSidebarVisible = state;
  }

  onCsvFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.csvFile = file;
    }
  }

  importCsvFile(): void {
    if (!this.csvFile) {
      Swal.fire('Erreur', 'Veuillez sélectionner un fichier CSV.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.csvFile);

    this.apprenantService.importApprenants(formData).subscribe(
      (response) => {
        const message = response.message || 'Fichier CSV importé avec succès!';
        Swal.fire('Succès', message, 'success');

        if (response.errors && response.errors.length > 0) {
          const errorList = response.errors.map((err: string) => `<li>${err}</li>`).join('');
          Swal.fire({
            icon: 'warning',
            title: 'Importation partielle',
            html: `Certains départements n'ont pas pu être importés :<ul>${errorList}</ul>`,
          });
        }

        this.csvFile = null; // Réinitialise la sélection de fichier
      },
      (error) => {
        const errorMsg = error.message || 'Une erreur est survenue lors de l\'importation.';
        const errorList = error.errors
          ? error.errors.map((err: string) => `<li>${err}</li>`).join('')
          : '';

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          html: `${errorMsg}${errorList ? `<ul>${errorList}</ul>` : ''}`,
        });
      }
    );
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.apprenantForm.patchValue({ photo: file });
  }

  onSubmit(): void {
    if (this.apprenantForm.valid) {
      const formData = new FormData();
      formData.append('nom', this.apprenantForm.value.nom);
      formData.append('prenom', this.apprenantForm.value.prenom);
      formData.append('adresse', this.apprenantForm.value.adresse);
      formData.append('telephone', this.apprenantForm.value.telephone);
      formData.append('photo', this.apprenantForm.value.photo);
      formData.append('cohorte_id', this.apprenantForm.value.cohorte_id);

      this.apprenantService.createApprenant(formData).subscribe((response) => {
        Swal.fire('Succès', 'Employé ajouté avec succès!', 'success');
        this.apprenantForm.reset();
      },
      (error) => {
        Swal.fire('Erreur', 'Une erreur est survenue lors de la création.', 'error');
        console.error(error);
      });
    }
  }
}
