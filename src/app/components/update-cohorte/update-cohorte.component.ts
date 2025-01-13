import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CohorteService } from '../../services/cohorte.service';
import { Cohorte } from '../../models/cohorte.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SideNavComponent } from '../side-nav/side-nav.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-cohorte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SideNavComponent],
  providers: [CohorteService],
  templateUrl: './update-cohorte.component.html',
  styleUrls: ['./update-cohorte.component.css']
})
export class UpdateCohorteComponent implements OnInit {
  cohorteForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  jours: string[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  // Générer des années par paire (par exemple "2020-2021", "2022-2023")
  getAnneePaire(): string[] {
    const startYear = 2020;  // Modifier selon l'année de début souhaitée
    const endYear = 2040;    // Modifier selon l'année de fin souhaitée
    const anneesPaires = [];

    for (let year = startYear; year < endYear; year += 2) {
      const pair = `${year}-${year + 1}`;
      anneesPaires.push(pair);
    }

    return anneesPaires;
  }

  constructor(
    private cohorteService: CohorteService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // Initialisation du formulaire
    this.cohorteForm = this.formBuilder.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      annee: ['', [Validators.required]],
      horaires: this.formBuilder.array([]) // FormArray pour les horaires
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getCohorte(id);
    }
  }

  get horaires(): FormArray {
    return this.cohorteForm.get('horaires') as FormArray;
  }

  // Récupérer la cohorte par ID et préremplir le formulaire
  getCohorte(id: number): void {
    this.cohorteService.getCohorteById(id).subscribe({
      next: (data) => {
        // Convertir les horaires si nécessaire
        const horaires = data.horaires.map(horaire => ({
          ...horaire,
          jours: typeof horaire.jours === 'string' ? JSON.parse(horaire.jours) : horaire.jours
        }));
        
        this.cohorteForm.patchValue({
          ...data,
          horaires: [] // On vide d'abord les horaires
        });
        this.setHoraires(horaires);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération de la cohorte: ' + err;
      }
    });
  }

  // Configurer les horaires dans le FormArray
  setHoraires(horaires: { jours: { [key: string]: boolean }; heure_debut: string; heure_fin: string }[]): void {
    const horairesFormArray = this.horaires;
    horairesFormArray.clear();

    horaires.forEach((horaire) => {
      horairesFormArray.push(this.createHoraireGroup(horaire));
    });
  }

  // Créer un FormGroup pour chaque horaire
  createHoraireGroup(horaire: any): FormGroup {
    // Si horaire.jours est une chaîne JSON, on doit la parser
    const jours = typeof horaire.jours === 'string' 
      ? JSON.parse(horaire.jours) 
      : horaire.jours;
  
    const joursFormGroup = this.formBuilder.group({});
    this.jours.forEach(jour => {
      joursFormGroup.addControl(jour, this.formBuilder.control(jours[jour] || false));
    });
  
    return this.formBuilder.group({
      jours: joursFormGroup,
      heure_debut: [horaire.heure_debut, Validators.required],
      heure_fin: [horaire.heure_fin, Validators.required]
    });
  }

  // Supprimer un horaire du formulaire
  removeHoraire(index: number): void {
    this.horaires.removeAt(index);
  }

  // Mettre à jour la cohorte
  // Dans update-cohorte.component.ts

  updateCohorte(): void {
    if (this.cohorteForm.valid) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      const formValue = this.cohorteForm.value;
      
      console.log('Valeurs brutes du formulaire:', formValue);
  
      const updatedCohorte = {
        id: id,
        nom: formValue.nom,
        description: formValue.description,
        annee: formValue.annee
      };
  
      console.log('Données finales envoyées à l\'API:', JSON.stringify(updatedCohorte, null, 2));
  
      // Vérification des champs requis
      if (!updatedCohorte.nom || !updatedCohorte.description || !updatedCohorte.annee) {
        console.error('Données manquantes dans le formulaire');
        Swal.fire('Données manquantes dans le formulaire.');
        // this.errorMessage = 'Données manquantes dans le formulaire';
        return;
      }
  
      this.cohorteService.updateCohorte(id, updatedCohorte).subscribe({
        next: (response) => {
          console.log('Réponse de l\'API après succès:', response);
          Swal.fire('Succès', 'Cohorte mise à jour avec succès!', 'success');
          // this.successMessage = 'Cohorte mise à jour avec succès!';
          this.router.navigate(['/cohortes']);
        },
        error: (err) => {
          console.error('Erreur détaillée:', err);
          console.error('Payload qui a causé l\'erreur:', updatedCohorte);
          this.errorMessage = 'Erreur lors de la mise à jour de la cohorte: ' + err;
        }
      });
    } else {
      console.error('Formulaire invalide:', this.cohorteForm.errors);
      this.errorMessage = 'Le formulaire contient des erreurs.';
    }
  }
}
