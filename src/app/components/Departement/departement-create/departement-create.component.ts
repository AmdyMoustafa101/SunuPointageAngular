import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { DepartementService } from '../../../services/departement.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { HeaderAndSidebarComponent } from "../../header-and-sidebar/header-and-sidebar.component";


interface Horaire {
  jours: { [key: string]: boolean };  // jours de la semaine
  heure_debut: string;                // Heure de début
  heure_fin: string;                  // Heure de fin
}

@Component({
  selector: 'app-departement-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderAndSidebarComponent],
  templateUrl: './departement-create.component.html',
  styleUrls: ['./departement-create.component.css']
})


export class DepartementCreateComponent implements OnInit {
  departementForm!: FormGroup;
  csvFile: File | null = null;


  // Exemple des jours de la semaine
  jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  constructor(private fb: FormBuilder, private departementService: DepartementService) {}

  ngOnInit(): void {
    // Initialisation du formulaire réactif
    this.departementForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      horaires: this.fb.array([])  // Initialisation d'un FormArray pour les horaires
    });

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

    this.departementService.importDepartements(formData).subscribe(
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





  get horaires(): FormArray {
    return this.departementForm.get('horaires') as FormArray;
  }

  addHoraire() {
    const horaireGroup = this.fb.group({
      jours: this.fb.group({
        lundi: [false],
        mardi: [false],
        mercredi: [false],
        jeudi: [false],
        vendredi: [false],
        samedi: [false]
      }),
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required]
    });

    this.horaires.push(horaireGroup);
  }

  removeHoraire(index: number) {
    this.horaires.removeAt(index);
  }

  onSubmit() {
    if (this.departementForm.valid) {
      console.log('Données envoyées:', this.departementForm.value);
      this.departementService.createDepartement(this.departementForm.value).subscribe(
        (response) => {
          Swal.fire('Succès', 'Employé ajouté avec succès!', 'success');
          console.log('Département créé avec succès:', response);
        },
        (error) => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la création.', 'error');
          console.error('Erreur lors de la création du département:', error);
        }
      );
    }
  }
}
