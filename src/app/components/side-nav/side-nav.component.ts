import { Component, OnInit } from '@angular/core';
import { EmployeService } from '../../services/employe.service';
// import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']  // Correction ici
})
export class SideNavComponent implements OnInit {  // Implémentation de OnInit

  admin: any;
  isSidebarVisible: boolean = true;
  dashboardDropdownVisible: boolean = false;
  cohortesDropdownVisible: boolean = false;
  departementsDropdownVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeService: EmployeService,
    private router: Router  // Correction ici
  ) {}

  ngOnInit(): void {
    // Get user data from the service
    this.admin = this.employeService.getUserData();
  }

   // Méthode pour afficher/masquer le dropdown
   toggleDropdown(dropdown: string): void {
    if (dropdown === 'dashboardDropdownVisible') {
      this.dashboardDropdownVisible = !this.dashboardDropdownVisible;
    } else if (dropdown === 'cohortesDropdownVisible') {
      this.cohortesDropdownVisible = !this.cohortesDropdownVisible;
    } else if (dropdown === 'departementsDropdownVisible') {
      this.departementsDropdownVisible = !this.departementsDropdownVisible;
    }
  }

  logout() {
    this.employeService.logout().subscribe({
      next: (response) => {
        this.employeService.clearToken(); // Supprimer le jeton
        this.router.navigate(['/login']);
        Swal.fire('Deconnexion réussie', response.message, 'success'),
        console.log('Déconnexion réussie');

      },
      error: (err) => Swal.fire('Erreur', err.error.message, 'error'),
    });
  }
}