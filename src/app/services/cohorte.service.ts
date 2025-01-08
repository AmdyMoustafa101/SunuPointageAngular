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

  importCohortes(fileData: FormData): Observable<any> {
    const url = `${this.apiUrl}/import`; // Assurez-vous que cette route existe côté Laravel
    return this.http.post<any>(url, fileData).pipe(
      catchError(this.handleError)
    );
  }

  getCohortes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue.';
    let errors = null;

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = error.error.message || `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
      errors = error.error.errors || null; // Vérifiez si des erreurs détaillées sont présentes
    }

    console.error(errorMessage); // Débogage
    return throwError(() => ({ message: errorMessage, errors }));
  }

}
