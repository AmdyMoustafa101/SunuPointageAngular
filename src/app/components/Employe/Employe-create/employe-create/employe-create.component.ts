import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeService } from '../../../../services/employe.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { HeaderAndSidebarComponent } from "../../../header-and-sidebar/header-and-sidebar.component";

@Component({
  selector: 'app-employe-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderAndSidebarComponent],
  templateUrl: './employe-create.component.html',
  styleUrls: ['./employe-create.component.css'],
})
export class EmployeCreateComponent implements OnInit {
  employeForm!: FormGroup;
  csvFile: File | null = null;
  departements: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeService: EmployeService
  ) {}

  ngOnInit(): void {
    this.employeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      adresse: ['', [Validators.required]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      role: ['', [Validators.required]],
      fonction: [''],
      departement_id: [''],
      email: [''],
      password: [''],
      photo: [null],
    });

    this.getDepartements();

    // Met à jour les champs selon le rôle
    this.employeForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'vigile') {
        this.employeForm.get('fonction')?.setValue('vigile');
        this.employeForm.get('departement_id')?.setValue(null);
        this.employeForm.get('departement_id')?.disable(); // Désactiver le champ
        this.employeForm.get('email')?.setValidators([Validators.required, Validators.email]);
        this.employeForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      } else {
        this.employeForm.get('departement_id')?.enable(); // Réactiver le champ
        this.employeForm.get('email')?.clearValidators();
        this.employeForm.get('password')?.clearValidators();
        this.employeForm.get('fonction')?.reset();
        this.employeForm.get('departement_id')?.reset();
      }
      this.employeForm.get('email')?.updateValueAndValidity();
      this.employeForm.get('password')?.updateValueAndValidity();
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

    this.employeService.importEmployes(formData).subscribe(
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

  getDepartements(): void {
    this.employeService.getDepartements().subscribe(
      (data) => (this.departements = data),
      (error) => console.error('Erreur lors du chargement des départements:', error)
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.employeForm.patchValue({ photo: file });
    }
  }

  onSubmit(): void {
    if (this.employeForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs requis.', 'error');
      return;
    }

    const formData = new FormData();
    Object.keys(this.employeForm.value).forEach((key) => {
      if (key === 'departement_id' && this.employeForm.get('departement_id')?.disabled) {
        return; // Ne pas inclure `departement_id` si désactivé
      }
      formData.append(key, this.employeForm.value[key]);
    });

    this.employeService.createEmploye(formData).subscribe(
      (response) => {
        Swal.fire('Succès', 'Employé ajouté avec succès!', 'success');
        this.employeForm.reset();
      },
      (error) => {
        Swal.fire('Erreur', 'Une erreur est survenue lors de la création.', 'error');
        console.error(error);
      }
    );
  }
}
