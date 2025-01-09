import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Departement } from '../models/departement.model';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private apiUrl = 'http://127.0.0.1:8002/api/departements';  // URL de l'API Laravel

  constructor(private http: HttpClient) {}

  // Récupérer tous les départements
  getDepartements(): Observable<Departement[]> {
    return this.http.get<Departement[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // // Créer un nouveau département
  // createDepartement(departementData: Departement): Observable<Departement> {
  //   return this.http.post<Departement>(this.apiUrl, departementData).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // Méthode pour ajouter un département
  addDepartement(departement: Departement): Observable<Departement> {
    return this.http.post<Departement>(this.apiUrl, departement).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer un département par ID
  getDepartementById(id: number): Observable<Departement> {
    return this.http.get<Departement>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour un département existant
  updateDepartement(id: number, departementData: Departement): Observable<Departement> {
    return this.http.put<Departement>(`${this.apiUrl}/${id}`, departementData).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer un département
  deleteDepartement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Archiver ou désarchiver un département
  archiveDepartement(id: number): Observable<Departement> {
    return this.http.patch<Departement>(`${this.apiUrl}/${id}/archive`, {}).pipe(
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