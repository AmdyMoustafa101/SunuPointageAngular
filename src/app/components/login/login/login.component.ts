import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeService } from '../../../services/employe.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isPasswordVisible: boolean = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private employeService: EmployeService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marque tous les champs comme touchés pour afficher les erreurs
      return;
    }

    const { email, password } = this.loginForm.value;
    console.log('Données de connexion :', { email, password });

    this.employeService.login(email, password).subscribe({
      next: (response) => {
        this.employeService.setUserData(response.user);
        this.employeService.saveToken(response.token);
        Swal.fire('Connexion réussie', response.message, 'success');
        const role = response.user.role;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        if (role === 'administrateur') {
          this.router.navigate(['/admin-page']);
        } else if (role === 'vigile') {
          this.router.navigate(['/vigile-page']);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la connexion :', err);
        Swal.fire('Erreur', err.error.message, 'error');
      },
    });
  }
}
