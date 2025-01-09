import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';
import { Router } from '@angular/router';
import { DepartementService } from '../../services/departement.service';
import { Departement } from '../../models/departement.model'; // Importer l'interface

type Jours = {
  [key: string]: boolean;
};

@Component({
  selector: 'app-departement-add',
  standalone: true,
  imports: [HeaderAndSidebarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './departement-add.component.html',
  styleUrls: ['./departement-add.component.css']
})
export class DepartementAddComponent implements OnInit {
  departementForm: FormGroup;
  errorMessage: string = '';
  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  constructor(
    private fb: FormBuilder,
    private departementService: DepartementService,
    private router: Router
  ) {
    const joursGroup: { [key: string]: any } = {};
    this.jours.forEach(jour => {
      joursGroup[jour] = [false];
    });

    this.departementForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      jours: this.fb.group(joursGroup as Jours),
      heure_debut: ['', [Validators.required]],
      heure_fin: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.departementForm.valid) {
      const formValue = this.departementForm.value;
      const newDepartement: Departement = {
        nom: formValue.nom,
        description: formValue.description,
        horaires: [
          {
            jours: formValue.jours,
            heure_debut: formValue.heure_debut,
            heure_fin: formValue.heure_fin
          }
        ],
        archive: false // ou null, ou laissez cette ligne si archive est optionnel
      };

      this.departementService.addDepartement(newDepartement).subscribe(
        (departement: Departement) => {
          // Naviguer vers la liste des départements avec le nouveau département
          this.router.navigate(['/departements'], { state: { newDepartement: departement } });
        },
        (error: any) => {
          console.error('Erreur lors de la création du département:', error);
          this.errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}\nDétails: ${error.error ? JSON.stringify(error.error) : ''}`;
        }
      );
    }
  }
}