import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeService } from '../../services/employe.service';
import { DepartementService } from '../../services/departement.service';
import { Employe } from '../../models/employe.model';
import { Departement } from '../../models/departement.model'; // Import the Departement model
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-liste-employes',
  standalone: true,
  imports: [CommonModule, SideNavComponent, FormsModule],
  templateUrl: './liste-employes.component.html',
  styleUrls: ['./liste-employes.component.css']
})
export class ListeEmployesComponent implements OnInit {
  employees: Employe[] = [];
  errorMessage: string = '';
  departementId: number | null = null;
  departement: Departement | null = null; // Define the property to store the department details
  anySelected: boolean = false; // Property to track if any employee is selected

  constructor(
    private employeService: EmployeService,
    private departementService: DepartementService,
    private router: Router,  // Add the router to navigate to the employe details page
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the department ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.departementId = Number(params.get('departementId'));
      console.log('Department ID:', this.departementId);
      if (this.departementId) {
        this.getDepartement(this.departementId); // Fetch the department details
        this.getEmployeesByDepartement(this.departementId);
      }
    });
  }

  getEmployeesByDepartement(departementId: number): void {
    this.employeService.getEmployeesByDepartement(departementId).subscribe(
      (data: Employe[]) => {
        // Initialize the selected property for each employee
        this.employees = data.map(employee => ({ ...employee, selected: false }));
        console.log('Employees retrieved:', this.employees);
      },
      (error: any) => {
        this.errorMessage = error.message;
        console.error('Error retrieving employees:', error);
      }
    );
  }

  getDepartement(departementId: number): void {
    this.departementService.getDepartementById(departementId).subscribe(
      (data: Departement) => {
        this.departement = data;
        console.log('Department details:', this.departement);
      },
      (error: any) => {
        this.errorMessage = error.message;
        console.error('Error retrieving department details:', error);
      }
    );
  }

  // Method to view employee details
  voirDetails(id: number): void {
    console.log(`Voir détails de l'employé ${id}`);
    // Add your logic to navigate to or display employee details
    this.router.navigate(['/employe-details', id]);
  }

  // Method to edit an employee
  modifierEmploye(id: number): void {
    console.log(`Modifier l'employé ${id}`);
    // Add your logic to navigate to or display employee edit form
    this.router.navigate(['/employe-edit', id]);
  }

  // Method to archive an employee
  archiverEmploye(id: number): void {
    this.employeService.archiveEmploye(id).subscribe(
      () => {
        console.log(`Employé ${id} archivé avec succès`);
        this.getEmployeesByDepartement(this.departementId!); // Refresh the employee list
      },
      (error: any) => {
        this.errorMessage = error.message;
        console.error('Error archiving employee:', error);
      }
    );
  }

  // Method to unarchive an employee
  desarchiverEmploye(id: number): void {
    this.employeService.unarchiveEmploye(id).subscribe(
      () => {
        console.log(`Employé ${id} désarchivé avec succès`);
        this.getEmployeesByDepartement(this.departementId!); // Refresh the employee list
      },
      (error: any) => {
        this.errorMessage = error.message;
        console.error('Error unarchiving employee:', error);
      }
    );
  }

  // Method to add a new employee
  ajouterEmploye(): void {
    console.log('Ajouter un nouvel employé');
    // Add your logic to navigate to or display employee creation form
    this.router.navigate(['/employe']);

  }

  // Method to archive multiple employees
  archiverMultiple(): void {
    const ids = this.employees.filter(e => e.selected).map(e => e.id);
    this.employeService.archiveMultipleEmployes(ids).subscribe(
      () => {
        console.log('Employés archivés avec succès');
        this.getEmployeesByDepartement(this.departementId!); // Refresh the employee list
      },
      (error: any) => {
        this.errorMessage = error.message;
        console.error('Error archiving multiple employees:', error);
      }
    );
  }

  // Method to unarchive multiple employees
  desarchiverMultiple(): void {
    const ids = this.employees.filter(e => e.selected).map(e => e.id);
    this.employeService.unarchiveMultipleEmployes(ids).subscribe(
      () => {
        console.log('Employés désarchivés avec succès');
        this.getEmployeesByDepartement(this.departementId!); // Refresh the employee list
      },
      (error: any) => {
        this.errorMessage = error.message;
        console.error('Error unarchiving multiple employees:', error);
      }
    );
  }

  // Method to toggle select all checkboxes
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.employees.forEach(e => e.selected = checked);
    this.updateAnySelected();
  }

  // Method to update the anySelected property
  updateAnySelected(): void {
    this.anySelected = this.employees.some(e => e.selected);
  }

  // Method to toggle the selection of a single employee
  toggleSelection(employee: Employe): void {
    employee.selected = !employee.selected;
    this.updateAnySelected();
  }
}