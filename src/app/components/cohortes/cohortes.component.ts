import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CohorteService } from '../../services/cohorte.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';


interface Horaire {
  jours: { [key: string]: boolean };  // jours de la semaine
  heure_debut: string;                // Heure de début
  heure_fin: string;                  // Heure de fin
}

@Component({
  selector: 'app-cohortes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cohortes.component.html',
  styleUrl: './cohortes.component.css'
})
export class CohortesComponent implements OnInit {

  cohorteForm!: FormGroup;
  jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  constructor(private fb: FormBuilder, private cohorteService: CohorteService) {}

  ngOnInit(): void {
    this.cohorteForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      annee: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      horaires: this.fb.array([]),
    });

    // Ajouter une entrée de formulaire vide pour les horaires
    this.addHoraire();
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

  // Soumission
  onSubmit(): void {
    if (this.cohorteForm.valid) {
      console.log('Données soumises :', this.cohorteForm.value);
      // Appeler un service pour envoyer les données au backend
      this.cohorteService.createCohorte(this.cohorteForm.value).subscribe(
        (response) => {
          Swal.fire('Succès', 'Employé ajouté avec succès!', 'success');
          console.log('Cohorte créée avec succès :', response);
        },
        (error) => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la création.', 'error');
          console.error('Erreur lors de la création de la cohorte :', error);
        }
      );
    } else {
      Swal.fire('Erreur', 'Une erreur est survenue lors de la création.', 'error');
      console.error('Le formulaire est invalide');
    }
  }

}
