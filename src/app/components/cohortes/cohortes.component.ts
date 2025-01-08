// src/app/components/cohortes/cohortes.component.ts
import { Component, OnInit } from '@angular/core';
import { CohorteService } from '../../services/cohorte.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AddCohorteComponent } from '../add-cohorte/add-cohorte.component'; // Assurez-vous que le chemin est correct
import { Cohorte, StatutCohorte } from '../../models/cohorte.model'; // Import du modèle

@Component({
  selector: 'app-cohortes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderAndSidebarComponent, RouterModule, ReactiveFormsModule, AddCohorteComponent],
  templateUrl: './cohortes.component.html',
  styleUrls: ['./cohortes.component.css']
})
export class CohortesComponent implements OnInit {
  cohortes: Cohorte[] = []; // Utilisation du modèle Cohorte
  errorMessage: string = '';
  cohorteForm: FormGroup;
  searchText: string = '';
  selectAll: boolean = false;

  // Ajout de la propriété statutCohorte pour accéder à l'énumération dans le template
  statutCohorte = StatutCohorte;

  constructor(private cohortService: CohorteService, private router: Router, private fb: FormBuilder) {
    this.cohorteForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      annee: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      statut: [StatutCohorte.ACTIVE, Validators.required], // Utilisation de l'énumération
      horaires: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadCohortes();
  }

  loadCohortes(): void {
    this.cohortService.getCohortes().subscribe(
      (data: Cohorte[]) => {
        // Inverser l'ordre des cohortes pour afficher le dernier ajouté en premier
        const sortedData = data.reverse(); // Utilisez `reverse` pour inverser l'ordre
        
        this.cohortes = sortedData.map(cohorte => ({
          ...cohorte,
          heure_debut: cohorte.horaires[0]?.heure_debut || 'Non défini', // Récupération de l'heure de début
          heure_fin: cohorte.horaires[0]?.heure_fin || 'Non défini', // Récupération de l'heure de fin
        }));
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des cohortes : ' + error.message;
        console.error(error);
      }
    );
  }
  

    // Gérer la sélection/désélection de toutes les cohortes
    toggleSelectAll(): void {
      this.cohortes.forEach(cohorte => {
        cohorte.selected = this.selectAll;
      });
    }

  isAnySelected(): boolean {
    return this.cohortes.some(cohorte => cohorte.selected);
  }

  // Gérer la sélection/désélection d'une cohorte
  toggleSelectCohorte(cohorteId: number): void {
      const cohorte = this.cohortes.find(c => c.id === cohorteId);
      if (cohorte) {
          cohorte.selected = !cohorte.selected;
      }
  }

  // Archiver les cohortes sélectionnées
  archiveSelectedCohortes(): void {
    const selectedCohortes = this.cohortes.filter(cohorte => cohorte.selected);
    selectedCohortes.forEach(cohorte => {
      this.cohortService.archiveCohorte(cohorte.id).subscribe(
        () => {
          console.log('Cohorte archivée avec succès');
          this.loadCohortes(); // Recharger la liste après archivage
        },
        (err: any) => {
          console.error('Erreur lors de l\'archivage de la cohorte', err);
        }
      );
    });
  }

  viewCohorte(id: number): void {
    this.router.navigate(['/cohorte', id]);
  }

  editCohorte(id: number): void {
    this.router.navigate(['/cohorte/edit', id]);
  }

  archiveCohorte(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir archiver cette cohorte ?')) {
      this.cohortService.archiveCohorte(id).subscribe(
        () => {
          this.loadCohortes();
        },
        (error) => {
          this.errorMessage = 'Erreur lors de l\'archivage de la cohorte : ' + error.message;
          console.error(error);
        }
      );
    }
  }

  // Méthode pour filtrer les cohortes par nom
  filterCohortes(): Cohorte[] {
    if (!this.searchText.trim()) {
      return this.cohortes;  // Si le champ de recherche est vide, afficher toutes les cohortes
    }
    return this.cohortes.filter(cohorte => 
      cohorte.nom.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSubmit(): void {
    if (this.cohorteForm.valid) {
      // Traitez l'ajout de la cohorte ici
      console.log(this.cohorteForm.value);
      // Ajoutez la logique pour envoyer les données au serveur ici si nécessaire
      this.cohorteForm.reset(); // Réinitialise le formulaire
    }
  }

  // Méthodes pour gérer les horaires
  get horaires(): FormArray {
    return this.cohorteForm.get('horaires') as FormArray;
  }

  addHoraire(): void {
    const horaireForm = this.fb.group({
      jours: this.fb.array([], Validators.required),
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required]
    });
    this.horaires.push(horaireForm);
  }

  removeHoraire(index: number): void {
    this.horaires.removeAt(index);
  }

  exportToCsv(): void {
    const csvData = this.convertToCsv(this.cohortes);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cohortes.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private convertToCsv(data: any[]): string {
    const headers = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return headers + rows;
  }
}