import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CohorteService } from '../../services/cohorte.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { HeaderAndSidebarComponent } from "../header-and-sidebar/header-and-sidebar.component";


interface Horaire {
  jours: { [key: string]: boolean };  // jours de la semaine
  heure_debut: string;                // Heure de début
  heure_fin: string;                  // Heure de fin
}

@Component({
  selector: 'app-cohortes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderAndSidebarComponent],
  templateUrl: './cohortes.component.html',
  styleUrl: './cohortes.component.css'
})
export class CohortesComponent implements OnInit {

  cohorteForm!: FormGroup;
  csvFile: File | null = null;
  jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  anneeErrorMessage: string | null = null;

  constructor(private fb: FormBuilder, private cohorteService: CohorteService) {}



  ngOnInit(): void {
    this.cohorteForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255),Validators.pattern(/^(?!\s*$|\d*$).*$/)]],
      description: ['', [Validators.required, Validators.pattern(/^(?!\s*$|\d*$).*$/)]],
      annee: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}-\d{4}$/), // Format YYYY-YYYY
        ],
      ],
      horaires: this.fb.array([]),
    });

    // Surveiller les erreurs en temps réel pour le champ "année"
    this.watchAnneeErrors();

    // Ajouter une entrée de formulaire vide pour les horaires
    this.addHoraire();
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

    this.cohorteService.importCohortes(formData).subscribe(
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

  // Getter pour les horaires
  get horaires(): FormArray {
    return this.cohorteForm.get('horaires') as FormArray;
  }

  // Ajouter un horaire
  addHoraire(): void {
    const horaireGroup = this.fb.group({
      jours: this.fb.group(
        this.jours.reduce((acc: any, jour) => {
          acc[jour] = [false];
          return acc;
        }, {})
      ),
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required],
    });

    this.horaires.push(horaireGroup);
  }

  // Supprimer un horaire
  removeHoraire(index: number): void {
    this.horaires.removeAt(index);
  }

  // Surveiller les erreurs en temps réel pour "année"
  watchAnneeErrors(): void {
    this.cohorteForm.get('annee')?.valueChanges.subscribe(() => {
      const anneeControl = this.cohorteForm.get('annee');
      if (anneeControl?.hasError('required')) {
        this.anneeErrorMessage = 'L\'année académique est requise.';
      } else if (anneeControl?.hasError('pattern')) {
        this.anneeErrorMessage =
          'L\'année académique doit être au format YYYY-YYYY.';
      } else {
        // Vérification personnalisée pour des années consécutives
        const annee = anneeControl?.value;
        const years = annee?.split('-').map(Number);
        if (years?.length === 2 && (years[1] - years[0] !== 1)) {
          this.anneeErrorMessage =
            'Les années doivent être consécutives (ex. 2023-2024).';
        } else {
          this.anneeErrorMessage = null;
        }
      }
    });
  }

  // Soumission
  // Soumission
  onSubmit(): void {
    if (this.cohorteForm.valid) {
      this.cohorteService.createCohorte(this.cohorteForm.value).subscribe(
        (response) => {
          Swal.fire('Succès', 'Cohorte créée avec succès!', 'success');
          console.log('Cohorte créée avec succès :', response);
        },
        (error) => {
          if (error.status === 422) {
            const errors = error.error?.errors || {};
            if (errors.nom) {
              Swal.fire('Erreur', errors.nom[0], 'error');
            } else {
              const validationErrors = Object.values(errors).flat().join('<br>');
              Swal.fire('Erreur de validation', validationErrors, 'error');
            }
          } else {
            Swal.fire(
              'Erreur',
              'Une erreur est survenue lors de la création.',
              'error'
            );
          }
          console.error('Erreur lors de la création de la cohorte :', error);
        }
      );
    } else {
      Swal.fire('Erreur', 'Veuillez vérifier les champs du formulaire.', 'error');
      console.error('Le formulaire est invalide');
    }
  }

}
