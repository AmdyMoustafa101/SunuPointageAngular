// add-apprenant.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApprenantService } from '../../services/apprenant.service';
import { Apprenant } from '../../models/apprenant.model'; // Assurez-vous d'importer le modèle correct
import { SideNavComponent } from '../side-nav/side-nav.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-apprenant',
  standalone: true,
  imports: [FormsModule, SideNavComponent, CommonModule],
  templateUrl: './add-apprenant.component.html',
  styleUrls: ['./add-apprenant.component.css']
})
export class AddApprenantComponent implements OnInit {
  newApprenant: Apprenant = {
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    matricule: '', // Ce champ sera rempli automatiquement
    photo: undefined, // Pour le fichier, si applicable
    cohorte_id: undefined, // Peut rester undefined si c'est optionnel
    archivé: false // Par défaut
  };
  selectedFile: File | null = null;
  cohortes: any[] = []; // Liste des cohortes

  constructor(private apprenantService: ApprenantService, private router: Router) {}

  ngOnInit(): void {
    // Récupérer les cohortes depuis le service
    this.apprenantService.getCohortes().subscribe(
      (data) => {
        this.cohortes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des cohortes:', error);
      }
    );
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      console.log('Fichier sélectionné:', this.selectedFile);
    }
  }

  ajouterApprenant(): void {
    // Générer le matricule avant d'envoyer les données
    this.newApprenant.matricule = this.generateMatricule();

    // Envoyer l'apprenant au service
    this.apprenantService.createApprenant(this.newApprenant).subscribe({
      next: () => {
        Swal.fire('Succès', 'Apprenant créée avec succès!', 'success');
        this.router.navigate(['/liste-apprenants']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'apprenant:', error);
        Swal.fire('Une erreur est survenue lors de l\'ajout de l\'apprenant.');
      }
    });
  }

  annuler(): void {
    this.router.navigate(['/liste-apprenants']);
  }

  generateMatricule(): string {
    return 'APP-' + Math.floor(Math.random() * 10000); // Exemple de génération
  }

  // Ajoutez une méthode pour gérer la sélection de fichiers si nécessaire
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newApprenant.photo = input.files[0]; // Assurez-vous que c'est un fichier
    }
  }
}
