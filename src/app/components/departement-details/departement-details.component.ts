import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DepartementService } from '../../services/departement.service';
import { Departement } from '../../models/departement.model';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';

@Component({
  selector: 'app-departement-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderAndSidebarComponent],
  templateUrl: './departement-details.component.html',
  styleUrls: ['./departement-details.component.css']
})
export class DepartementDetailsComponent implements OnInit {
  departement: Departement | undefined;
  errorMessage: string = '';
  showModal: boolean = false;

  constructor(private route: ActivatedRoute, private departementService: DepartementService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getDepartementById(Number(id));
    }
  }

  getDepartementById(id: number): void {
    this.departementService.getDepartementById(id).subscribe(
      (data: Departement) => this.departement = data,
      (error: any) => this.errorMessage = error.message
    );
  }

  modifierDepartement(): void {
    // Implémentez la logique pour modifier le département
  }

  archiverDepartement(): void {
    this.showModal = true; // Afficher le modal de confirmation
  }

  onConfirmArchiver(): void {
    if (this.departement && this.departement.id !== undefined) {
      this.departementService.archiveDepartement(this.departement.id).subscribe(
        () => {
          this.router.navigate(['/departements']);
        },
        (error: any) => {
          this.errorMessage = error.message;
        }
      );
    }
    this.showModal = false; // Fermer le modal après confirmation
  }

  onCloseModal(): void {
    this.showModal = false; // Fermer le modal sans action
  }

  getJours(jours: { [key: string]: boolean }): string[] {
    return Object.keys(jours).filter(jour => jours[jour]);
  }

  // Méthode pour rediriger vers la page liste-employes
  EmployeeList(): void {
    if (this.departement && this.departement.id) {
      this.router.navigate(['/liste-employes', this.departement.id]);
    } else {
      this.errorMessage = 'ID de département non disponible';
    }
  }
}