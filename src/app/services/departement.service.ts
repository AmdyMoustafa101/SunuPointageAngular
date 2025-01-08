import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private apiUrl = 'http://127.0.0.1:8002/api/departements';  // URL de l'API Laravel

  constructor(private http: HttpClient) {}

  // Récupérer tous les départements
  getDepartements(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Créer un nouveau département
  createDepartement(departementData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, departementData).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer un département par ID
  getDepartementById(departementId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${departementId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour un département existant
  updateDepartement(departementId: number, departementData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${departementId}`, departementData).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer un département
  deleteDepartement(departementId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${departementId}`).pipe(
      catchError(this.handleError)
    );
  }
  

  // Gérer les erreurs
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
