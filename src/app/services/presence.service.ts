import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private apiUrl = 'http://localhost:3005/api/presences'; // URL de l'API Node.js

  constructor(private http: HttpClient) {}

  getPresences(date: string, role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?date=${date}&role=${role}`);
  }
}
