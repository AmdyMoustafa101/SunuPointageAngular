import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LogoutResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})

export class EmployeService {
  private apiUrl = 'http://localhost:8002/api/employes'; // URL de l'API Laravel

  constructor(private http: HttpClient) {}

  createEmploye(employeData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, employeData);
  }

  getDepartements(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8002/api/departements');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:8002/api/login`, { email, password });
  }

  // Fonction de logout
  logout(): Observable<any> {
    return this.http.post(`http://localhost:8002/api/logout`, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    });
  }

  // Enregistrement du token dans le stockage local
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Suppression du token du stockage local
  clearToken(): void {
    localStorage.removeItem('token');
  }

  // Récupération du token du stockage local
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
