import { Component } from '@angular/core';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-forgot-pass',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './forgot-pass.component.html',
  styleUrl: './forgot-pass.component.css'
})
export class ForgotPassComponent {

  email: string = '';
  message: string = '';
  errorMessage: string = '';

  constructor(private forgotPasswordService: ForgotPasswordService) {}

  onSubmit() {
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer un email valide.';
      return;
    }

    this.forgotPasswordService.sendResetLink(this.email).pipe(
      tap(response => {
        this.message = 'Un lien de réinitialisation a été envoyé à votre email.';
        this.errorMessage = ''; // Réinitialiser le message d'erreur
      }),
      catchError(error => {
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.message = ''; // Réinitialiser le message de succès
        return of(); // Retourner un observable vide
      })
    ).subscribe();
  }

}
