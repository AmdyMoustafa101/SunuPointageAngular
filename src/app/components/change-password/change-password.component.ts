// src/app/components/change-password/change-password.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '../../services/password.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  email: string = '';  // L'email sera extrait de l'URL
  newPassword: string = '';
  newPasswordConfirmation: string = '';
  status: string = '';
  statusMessage: string = '';

  constructor(
    private passwordService: PasswordService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // Extraire l'email passé dans l'URL
    this.activatedRoute.params.subscribe(params => {
      this.email = params['email'];  // Récupérer l'email de l'URL
    });
  }

  // Méthode de soumission du formulaire
  onSubmit() {
    if (this.newPassword !== this.newPasswordConfirmation) {
      this.status = 'error';
      this.statusMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.passwordService
      .changePassword(this.email, this.newPassword, this.newPasswordConfirmation)
      .subscribe(
        (response) => {
          this.status = 'success';
          this.statusMessage = response.message;
          // Vous pouvez rediriger l'utilisateur après la réussite
          this.router.navigate(['/login']);  // Exemple: redirection vers la page de login
        },
        (error) => {
          this.status = 'error';
          this.statusMessage = error.error.message || 'Une erreur est survenue.';
        }
      );
  }
}

// Configuration des modules nécessaires pour ce composant
@NgModule({
  declarations: [
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,  // Pour ngModel
    HttpClientModule,  // Pour les requêtes HTTP
    RouterModule.forRoot([
      { path: 'change-password/:email', component: ChangePasswordComponent },
      { path: '', redirectTo: '/change-password', pathMatch: 'full' },
    ]),
  ],
  providers: [PasswordService],
  bootstrap: [ChangePasswordComponent],
})
export class ChangePasswordModule {}
