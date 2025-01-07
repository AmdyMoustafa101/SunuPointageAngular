// src/app/services/statistics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8002/api/statistics'; // URL de votre API

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<{
    totalEmployees: number;
    totalLearners: number;
    totalDepartments: number;
    totalCohorts: number;
  }> {
    return this.http.get<{
      totalEmployees: number;
      totalLearners: number;
      totalDepartments: number;
      totalCohorts: number;
    }>(this.apiUrl);
  }
}