import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { DepartementService } from '../../../services/departement.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';


interface Horaire {
  jours: { [key: string]: boolean };  // jours de la semaine
  heure_debut: string;                // Heure de début
  heure_fin: string;                  // Heure de fin
}

@Component({
  selector: 'app-departement-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './departement-create.component.html',
  styleUrls: ['./departement-create.component.css']
})


export class DepartementCreateComponent implements OnInit {
  departementForm!: FormGroup;

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
