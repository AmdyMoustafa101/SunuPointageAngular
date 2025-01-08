import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeService } from '../../../services/employe.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isPasswordVisible: boolean = false;
  errorMessage = '';
  ws: WebSocket | null = null;

  constructor(
    private fb: FormBuilder,
    private employeService: EmployeService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,  Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.employeService.initializeWebSocket();
    this.employeService.setLoginPageState(true);
    this.listenForRFIDScans();
  }

  ngOnDestroy(): void {
    this.employeService.setLoginPageState(false);
}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.employeService.login(email, password).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response);
      },
      error: (err) => {
        this.handleLoginError(err);
      },
    });
  }



  private handleLoginSuccess(response: any) {
    this.employeService.setUserData(response.user);  // Stocker les données utilisateur
    this.employeService.saveToken(response.token);   // Stocker le token
    localStorage.setItem('token', response.token);    // Sauvegarder le token dans localStorage
    localStorage.setItem('user', JSON.stringify(response.user)); // Sauvegarder les données utilisateur dans localStorage

    const role = response.user.role;
    if (role === 'administrateur') {
      this.router.navigate(['/admin-page']);
    } else if (role === 'vigile') {
      this.router.navigate(['/vigile-page']);
    }
  }

  private handleLoginError(err: any) {
    console.error('Erreur lors de la connexion :', err);
    Swal.fire('Erreur', err.error.message, 'error');
  }

  private handleRFIDLogin(rfidCardId: string): void {
    this.employeService.loginByCard(rfidCardId).subscribe({
        next: (response) => {
            this.handleLoginSuccess(response);
        },
        error: (err) => {
            Swal.fire('Erreur', err.error.message || 'Échec de la connexion.', 'error');
        },
    });
}


  private listenForRFIDScans(): void {
    this.employeService.getWebSocketMessages().subscribe((message) => {
        if (message.type === 'mode' && message.mode === 'login') {
            Swal.fire({
                title: 'Mode Connexion activé',
                text: 'Veuillez scanner votre carte.',
                icon: 'info',
                showConfirmButton: false,
                timer: 1500,
            });
        } else if (message.type === 'card' && message.cardID) {
            // Appeler la méthode pour traiter la connexion via RFID
            this.handleRFIDLogin(message.cardID);
        }
    });
}


}

