// cohorte.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cohorte } from '../models/cohorte.model';

@Injectable({
  providedIn: 'root'
})
export class CohorteService {
  private apiUrl = 'http://127.0.0.1:8002/api/cohortes';

  constructor(private http: HttpClient) {}

  createCohorte(cohorteData: Partial<Cohorte>): Observable<Cohorte> {
    return this.http.post<Cohorte>(this.apiUrl, cohorteData).pipe(
      catchError(this.handleError)
    );
  }

  getCohortes(): Observable<Cohorte[]> {
    return this.http.get<Cohorte[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCohorteById(id: number): Observable<Cohorte> {
    return this.http.get<Cohorte>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateCohorte(id: number, cohorteData: Partial<Cohorte>): Observable<Cohorte> {
    return this.http.put<Cohorte>(`${this.apiUrl}/${id}`, cohorteData).pipe(
      catchError(this.handleError)
    );
  }

  archiveCohorte(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/archive`, {}).pipe(
      catchError(this.handleError)
    );
  }

   // Nouvelle méthode pour archiver plusieurs cohortes
   archiveMultipleCohortes(ids: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/archive-multiple`, { ids }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

   // Méthode pour récupérer les apprenants d'une cohorte spécifique
  //  getApprenantsByCohorte(id: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/apcohortes/  /apprenants`);
  // }  
}