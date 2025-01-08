import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { DepartementService } from '../../../services/departement.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface Horaire {
  jours: { [key: string]: boolean };
  heure_debut: string;
  heure_fin: string;
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
  departements: any[] = []; // Liste des départements
  jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  isFormVisible = false;  // Variable pour contrôler l'affichage du formulaire

  constructor(
    private fb: FormBuilder, 
    private departementService: DepartementService,
    private router: Router  // Ajoutez le router pour la navigation
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire réactif
    this.departementForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      horaires: this.fb.array([])  // Initialisation d'un FormArray pour les horaires
    });

    // Ajouter une entrée de formulaire vide pour les horaires
    this.addHoraire();

    // Charger les départements existants
    this.loadDepartements();
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
          Swal.fire('Succès', 'Département ajouté avec succès!', 'success');
          this.loadDepartements(); // Recharge la liste des départements après la création
          this.isFormVisible = false; // Cache le formulaire après soumission
          console.log('Département créé avec succès:', response);
        },
        (error) => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la création.', 'error');
          console.error('Erreur lors de la création du département:', error);
        }
      );
    }
  }

  loadDepartements() {
    this.departementService.getDepartements().subscribe(
      (response) => {
        console.log('Réponse de l\'API:', response);  // Vérifiez la réponse ici
        this.departements = response;  // Charge les départements dans la liste
      },
      (error) => {
        console.error('Erreur lors du chargement des départements:', error);
      }
    );
  }
  

  deleteDepartement(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Suppression du département via le service
        this.departementService.deleteDepartement(id).subscribe(
          (response) => {
            Swal.fire('Supprimé!', 'Le département a été supprimé.', 'success');
            this.loadDepartements(); // Recharge la liste après suppression
          },
          (error) => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
            console.error('Erreur lors de la suppression du département:', error);
          }
        );
      }
    });
  }

  editDepartement(departement: any) {
    // Redirection vers la page d'édition, passez l'ID du département dans l'URL
    this.router.navigate([`/departement/edit/${departement.id}`]);
  }

  // Méthode pour afficher ou cacher le formulaire
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }
}
