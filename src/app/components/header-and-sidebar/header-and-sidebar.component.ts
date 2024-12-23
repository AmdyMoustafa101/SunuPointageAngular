import { Component, OnInit } from '@angular/core';
import { EmployeService } from '../../services/employe.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { HistoriqueLogsComponent } from '../historique-logs/historique-logs.component';

import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-and-sidebar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './header-and-sidebar.component.html',
  styleUrl: './header-and-sidebar.component.css'
})
export class HeaderAndSidebarComponent  implements OnInit{

  ngOnInit(): void {
    // Get user data from the service
    this.admin = this.employeService.getUserData();
  }

  constructor(private fb: FormBuilder,private employeService: EmployeService, private router: Router) {}

  admin: any;

  isSidebarVisible: boolean = true;

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
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
