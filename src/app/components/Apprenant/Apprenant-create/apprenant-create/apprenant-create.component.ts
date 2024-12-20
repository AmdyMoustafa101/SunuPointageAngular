import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApprenantService } from '../../../../services/apprenant.service';
import { CohorteService } from '../../../../services/cohorte.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

// Déclarez l'interface pour la cohorte
interface Cohorte {
  id: number;
  nom: string;
  annee: string;
}

@Component({
  selector: 'app-apprenant-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './apprenant-create.component.html',
  styleUrl: './apprenant-create.component.css'
})
export class ApprenantCreateComponent implements OnInit {
  apprenantForm!: FormGroup;
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
