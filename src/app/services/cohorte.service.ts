import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CohorteService {
  private apiUrl = 'http://127.0.0.1:8002/api/cohortes';  // URL de l'API Laravel

  constructor(private http: HttpClient) {}

  createCohorte(cohorteData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cohorteData).pipe(
      catchError(this.handleError)
    );
  }

  getCohortes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCohorteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateCohorte(id: number, cohorteData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cohorteData).pipe(
      catchError(this.handleError)
    );
  }

  archiveCohorte(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/archive`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);  // Affiche l'erreur dans la console pour le débogage
    return throwError(() => new Error(errorMessage));
  }
}