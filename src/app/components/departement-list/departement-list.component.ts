import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepartementService } from '../../services/departement.service';
import { Departement } from '../../models/departement.model';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';

@Component({
  selector: 'app-departement-list',
  standalone: true,
  imports: [HeaderAndSidebarComponent, CommonModule],
  templateUrl: './departement-list.component.html',
  styleUrls: ['./departement-list.component.css']
})
export class DepartementListComponent implements OnInit {
  departements: Departement[] = [];
  errorMessage: string = '';

  constructor(private departementService: DepartementService, private router: Router) {}

  ngOnInit(): void {
    this.getDepartements();

    // Vérifiez s'il y a un nouveau département dans l'état de navigation
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['newDepartement']) {
      this.addNewDepartementToList(navigation.extras.state['newDepartement']);
    }
  }

  getDepartements(): void {
    this.departementService.getDepartements().subscribe(
      (data: Departement[]) => this.departements = data,
      (error: any) => this.errorMessage = error.message
    );
  }

  viewDepartement(id: number): void {
    // Rediriger vers la page de détails du département
    this.router.navigate(['/departement-details', id]);
  }

  editDepartement(id: number): void {
    this.router.navigate(['/departement-edit', id]);
  }

  archiveDepartement(id: number): void {
    this.departementService.archiveDepartement(id).subscribe(
      (data: Departement) => {
        console.log('Département archivé avec succès');
        this.departements = this.departements.map(departement => 
          departement.id === id ? { ...departement, archive: true } : departement
        );
      },
      (error: any) => {
        console.error('Erreur lors de l\'archivage du département:', error);
        this.errorMessage = error.message;
      }
    );
  }

  addDepartement(): void {
    // Rediriger vers la page d'ajout de département
    this.router.navigate(['/departement-add']);
  }

  addNewDepartementToList(departement: Departement): void {
    // Ajouter le nouveau département en tête de liste
    this.departements.unshift(departement);
  }

  truncateDescription(description: string, maxLength: number = 50): string {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  }
}