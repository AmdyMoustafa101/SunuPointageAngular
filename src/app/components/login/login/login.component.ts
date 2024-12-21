import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { EmployeService } from '../../../services/employe.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isPasswordVisible: boolean = false;

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
      return;
    }

    const { email, password } = this.loginForm.value;
    console.log('Données de connexion :', { email, password });

    this.employeService.login(email, password).subscribe({
      next: (response) => {
        this.employeService.saveToken(response.token);
        Swal.fire('Connexion réussie', response.message, 'success');
        const role = response.user.role;

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
