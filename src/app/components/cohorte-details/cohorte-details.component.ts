import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CohorteService } from '../../services/cohorte.service';
import { NotificationService } from '../../services/notification.service';
import { Cohorte } from '../../models/cohorte.model';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationModalComponent } from '../modal/modal.component'; // Importer le module
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-cohorte-details',
    standalone: true,
    imports: [SideNavComponent, CommonModule, ConfirmationModalComponent, FormsModule], // Ajouter le module ici
    templateUrl: './cohorte-details.component.html',
    styleUrls: ['./cohorte-details.component.css']
})
export class CohorteDetailsComponent implements OnInit {
    cohorte!: Cohorte;
    errorMessage: string = '';
    showModal: boolean = false; // Pour contrôler l'affichage du modal

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cohorteService: CohorteService,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.loadCohorte();
    }

    private loadCohorte(): void {   
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
          this.errorMessage = 'ID de cohorte non fourni';
          return;
      }
  
      this.cohorteService.getCohorteById(Number(id)).subscribe({
          next: (data: Cohorte) => {
              this.cohorte = data;
              this.cohorte.horaires = data.horaires; // Assurez-vous que c'est un tableau Horaire[]
              console.log('Cohorte data:', this.cohorte);
          },
          error: (err: HttpErrorResponse) => {
              this.errorMessage = `Erreur lors du chargement de la cohorte : ${err.message}`;
          }
      });
  }

    getJours(jours: { [key: string]: boolean }): string[] {
        return Object.keys(jours).filter(jour => jours[jour]);
    }

    modifierCohorte(): void {
        if (this.cohorte) {
            this.router.navigate(['/cohortes/modifier', this.cohorte.id]);
        }
    }

    archiverCohorte(): void {
        this.showModal = true; // Afficher le modal
    }

    onConfirmArchiver(): void {
        if (this.cohorte) {
            this.cohorteService.archiveCohorte(this.cohorte.id).subscribe({
                next: () => {
                    this.router.navigate(['/cohortes']);
                },
                error: (err: HttpErrorResponse) => {
                    this.errorMessage = `Erreur lors de l'archivage de la cohorte : ${err.message}`;
                }
            });
        }
        this.showModal = false; // Fermer le modal après confirmation
    }

    onCloseModal(): void {
        this.showModal = false; // Fermer le modal
    }

    voirApprenants(): void {
        if (this.cohorte) {
            this.router.navigate(['/cohorte', this.cohorte.id, 'apprenants']);  // Utilisez this.cohorte.id
        }
    }

    onStatutChange(): void {
        if (this.cohorte) {
          this.cohorteService.updateCohorte(this.cohorte.id, { statut: this.cohorte.statut }).subscribe(
            () => {
              console.log('Statut de la cohorte mis à jour avec succès');
            },
            (error) => {
              this.errorMessage = 'Erreur lors de la mise à jour du statut de la cohorte : ' + error.message;
            }
          );
        }
      }

      
}