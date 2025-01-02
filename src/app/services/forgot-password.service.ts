import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private apiUrl = 'http://127.0.0.1:3005/send-email'; // Remplacez avec votre URL API

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer l'email de réinitialisation
  sendResetLink(email: string): Observable<any> {
    return this.http.post(this.apiUrl, { email });
  }
}
