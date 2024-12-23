import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PointageService {
  private apiUrl = 'http://localhost:8002/api/enregistrer-pointage'; // URL pour enregistrer
  private statusApiUrl = 'http://localhost:3000/api/status-pointage'; // URL pour vérifier le statut

  constructor(private http: HttpClient) {}

  getAuthToken() {
    return localStorage.getItem('token');
  }

  enregistrerPointage(pointage: any): Observable<any> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Token non trouvé');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, pointage, { headers });
  }
}
