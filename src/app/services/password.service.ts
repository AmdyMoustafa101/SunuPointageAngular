// src/app/services/password.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private apiUrl = 'http://127.0.0.1:8002/change-password'; // URL de l'API Laravel

  constructor(private http: HttpClient) {}

  // Méthode pour changer le mot de passe
  changePassword(email: string, newPassword: string, newPasswordConfirmation: string): Observable<any> {
    const body = {
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    };

    // En-têtes HTTP
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(`${this.apiUrl}/${email}`, body, { headers });
  }
}
