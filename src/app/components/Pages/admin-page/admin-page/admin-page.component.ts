import { Component, OnInit } from '@angular/core';
import { EmployeService } from '../../../../services/employe.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { HeaderAndSidebarComponent } from "../../../header-and-sidebar/header-and-sidebar.component";


@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderAndSidebarComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  ngOnInit(): void {
    // Get user data from the service
    this.admin = this.employeService.getUserData();
  }

  constructor(private fb: FormBuilder,private employeService: EmployeService, private router: Router) {}

  admin: any;

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
