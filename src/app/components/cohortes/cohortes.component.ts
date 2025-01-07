import { Component, OnInit } from '@angular/core';
import { CohorteService } from '../../services/cohorte.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AddCohorteComponent } from '../add-cohorte/add-cohorte.component'; // Assurez-vous que le chemin est correct

interface Horaire {
  jours: string[];
  heure_debut: string;
  heure_fin: string;
}

interface Cohorte {
  id: number;
  nom: string;
  startDate: Date;
  endDate: Date; // Ajout de l'heure de fin
  statut: 'active' | 'terminée'; // Changement ici pour le statut
  annee: number; // Ajout de l'année
  horaires: Horaire[]; // Ajout des horaires
  isSelected?: boolean; // Ajout de la propriété pour la sélection
}

@Component({
  selector: 'app-cohortes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderAndSidebarComponent, RouterModule, ReactiveFormsModule, AddCohorteComponent],
  templateUrl: './cohortes.component.html',
  styleUrls: ['./cohortes.component.css']
})
export class CohortesComponent implements OnInit {
  cohortes: Cohorte[] = []; // Utilisation de l'interface Cohorte
  errorMessage: string = '';
  cohorteForm: FormGroup;
  searchText: string = '';
  masterCheck: boolean = false;

  constructor(private cohortService: CohorteService, private router: Router, private fb: FormBuilder) {
    this.cohorteForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      annee: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      statut: ['active', Validators.required], // Ajout du statut avec valeur par défaut
      horaires: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadCohortes();
  }

  loadCohortes(): void {
    this.cohortService.getCohortes().subscribe(
        (data: Cohorte[]) => {
            this.cohortes = data.map(cohorte => {
                return {
                    ...cohorte,
                    startDate: new Date(cohorte.startDate), // Conversion en date
                    endDate: new Date(cohorte.endDate), // Conversion en date
                    // Vous pouvez ajouter des propriétés pour les heures de début et de fin si nécessaire
                    heure_debut: cohorte.horaires[0]?.heure_debut || 'Non défini', // Récupération de l'heure de début
                    heure_fin: cohorte.horaires[0]?.heure_fin || 'Non défini', // Récupération de l'heure de fin
                };
            });
        },
        (error) => {
            this.errorMessage = 'Erreur lors de la récupération des cohortes : ' + error.message;
            console.error(error);
        }
    );
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