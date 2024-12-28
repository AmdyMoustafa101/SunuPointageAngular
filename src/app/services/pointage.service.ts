import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PointageService {
  private apiUrl = 'http://localhost:8002/api/enregistrer-pointage';
  private pointagesUrl = 'http://localhost:3005/api/pointages';

  constructor(private http: HttpClient) {}

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  enregistrerPointage(pointage: any): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, pointage, { headers });
  }

  getPointages(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.pointagesUrl}?date=${date}`);
  }
}
