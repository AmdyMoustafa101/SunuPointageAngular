import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private apiUrl = 'http://localhost:3005/api/presences'; // URL de l'API Node.js
  private baseUrl: string = 'http://127.0.0.1:3005';

  constructor(private http: HttpClient) {}

  getPresences(date: string, role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?date=${date}&role=${role}`);
  }

  getPresencesByDepartement(date: string, departementId: string): Observable<any> {
    const params = new HttpParams()
      .set('date', date)
      .set('departementId', departementId);

    return this.http.get(`${this.baseUrl}/api/presences/departement`, { params });
  }

  getPresencesByCohorte(date: string, cohorteId: string): Observable<any> {
    const params = new HttpParams()
      .set('date', date)
      .set('cohorteId', cohorteId);

    return this.http.get(`${this.baseUrl}/api/presences/cohorte`, { params });
  }

  getWeeklyPresencesByDepartement(
    dateRangeStart: string,
    dateRangeEnd: string,
    departementId: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('dateRangeStart', dateRangeStart)
      .set('dateRangeEnd', dateRangeEnd)
      .set('departementId', departementId);

    return this.http.get(`${this.baseUrl}/api/weekly-presences/departement`, { params });
  }

  getWeeklyPresencesByCohorte(
    dateRangeStart: string,
    dateRangeEnd: string,
    cohorteId: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('dateRangeStart', dateRangeStart)
      .set('dateRangeEnd', dateRangeEnd)
      .set('cohorteId', cohorteId);

    return this.http.get(`${this.baseUrl}/api/weekly-presences/cohorte`, { params });
  }
  
}
