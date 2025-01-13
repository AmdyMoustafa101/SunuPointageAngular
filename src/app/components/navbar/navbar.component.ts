import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { EmployeService } from '../../services/employe.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  admin: any;

  constructor(
    private fb: FormBuilder,
    private employeService: EmployeService,
    private router: Router  // Correction ici
  ) {}


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
