import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CohorteService } from '../../services/cohorte.service';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from '../side-nav/side-nav.component';

import Swal from 'sweetalert2';

interface Horaire {
  jours: { [key: string]: boolean };  // jours de la semaine
  heure_debut: string;                // Heure de début
  heure_fin: string;                  // Heure de fin
}

@Component({
  selector: 'app-add-cohorte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SideNavComponent],
  templateUrl: './add-cohorte.component.html', // Assurez-vous que le chemin est correct
  styleUrls: ['./add-cohorte.component.css'] // Correction de styleUrl à styleUrls
})
export class AddCohorteComponent implements OnInit { // Changement de nom de classe

  cohorteForm!: FormGroup;
  jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  constructor(private fb: FormBuilder, private cohorteService: CohorteService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.addHoraire(); // Ajouter une entrée de formulaire vide pour les horaires
  }

  private initializeForm(): void {
    this.cohorteForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      annee: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      horaires: this.fb.array([]),
    });
  }

  get horaires(): FormArray {
    return this.cohorteForm.get('horaires') as FormArray;
  }

  addHoraire(): void {
    const horaireGroup = this.fb.group({
      jours: this.fb.group(
        this.jours.reduce((acc: any, jour) => {
          acc[jour] = [false]; // Chaque jour est initialisé à false
          return acc;
        }, {})
      ),
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required],
    });
  
    // Insérer le nouvel horaire à l'index 0 pour le mettre en tête de liste
    this.horaires.insert(0, horaireGroup);
  }
  

  removeHoraire(index: number): void {
    this.horaires.removeAt(index);
  }

  onSubmit(): void {
    if (this.cohorteForm.valid) {
      console.log('Données soumises :', this.cohorteForm.value);
      this.cohorteService.createCohorte(this.cohorteForm.value).subscribe(
        (response) => {
          Swal.fire('Succès', 'Cohorte créée avec succès!', 'success'); // Message de succès
          console.log('Cohorte créée avec succès :', response);
        },
        (error) => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la création.', 'error'); // Message d'erreur
          console.error('Erreur lors de la création de la cohorte :', error);
        }
      );
    } else {
      Swal.fire('Erreur', 'Le formulaire est invalide.', 'error'); // Message si le formulaire est invalide
      console.error('Le formulaire est invalide');
    }
  }
}