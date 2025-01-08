import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = 'http://127.0.0.1:3005/api';

  constructor(private http: HttpClient) {}

  getWeeklyData(startDate: string, endDate: string): Observable<any> {
    const url = `${this.apiUrl}/statistiques-semaine?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<any>(url);
  }

  getMonthlyData(year: string): Observable<any> {
    const url = `${this.apiUrl}/statistiques-mois?year=${year}`;
    return this.http.get<any>(url);
  }


  getDailyData(date: string): Observable<any> {
    const endpoint = `${this.apiUrl}/absences-retards`;
    const params = new HttpParams().set('date', date);

    return this.http.get(endpoint, { params });
  }

}
