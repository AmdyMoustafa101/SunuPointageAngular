// src/app/services/apprenant.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Apprenant, ApprenantStats, ApprenantFormData } from '../models/apprenant.model';


@Injectable({
    providedIn: 'root'
})
export class ApprenantService {
    private apiUrl = 'http://127.0.0.1:8002/api';  // Ajustez l'URL selon votre configuration

    constructor(private http: HttpClient) { }

    // Récupérer tous les apprenants
    getApprenants(): Observable<Apprenant[]> {
        return this.http.get<Apprenant[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    // Récupérer un apprenant par ID
    getApprenantById(id: number): Observable<Apprenant> {
        return this.http.get<Apprenant>(`${this.apiUrl}/apprenants/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    // Créer un nouvel apprenant
    // Créer un nouvel apprenant
    createApprenant(apprenantData: Partial<Apprenant>): Observable<Apprenant> {
        return this.http.post<Apprenant>(`${this.apiUrl}/apprenants`, apprenantData).pipe(
            catchError(this.handleError)
        );
    }

    getCohortes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/cohortes`).pipe(
          catchError(this.handleError)
        );
      }


    // Dans apprenant.service.ts
    updateApprenant(id: number, apprenantData: Partial<Apprenant>): Observable<Apprenant> {
        return this.http.put<Apprenant>(`${this.apiUrl}/apprenants/${id}`, apprenantData).pipe(
          catchError(this.handleError)
        );
      }

    // src/app/services/apprenant.service.ts

supprimerApprenants(ids: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/apprenants/delete-multiple`, { ids }).pipe(
        catchError(this.handleError)
    );
}


    // Récupérer les statistiques
    getStats(): Observable<ApprenantStats> {
        return this.http.get<ApprenantStats>(`${this.apiUrl}/counts`).pipe(
            catchError(this.handleError)
        );
    }

    // Récupérer les apprenants par cohorte
    getApprenantsByCohorte(id: number): Observable<Apprenant[]> {
        return this.http.get<Apprenant[]>(`${this.apiUrl}/cohortes/${id}/apprenant`).pipe(
            catchError(this.handleError)
        );
    }

    // Dans apprenant.service.ts, modifiez la méthode archiverApprenant:
    archiverApprenant(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/apprenants/${id}/archive`, {});
      }
    
      archiverApprenants(ids: number[]): Observable<any> {
        return this.http.post(`${this.apiUrl}apprenants/archive`, { ids });
      }
      

    // Gestion des erreurs
    private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = 'Une erreur est survenue';
      
      if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          errorMessage = `Erreur: ${error.error.message}`;
      } else {
          // Erreur côté serveur
          errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}\nDétails: ${JSON.stringify(error.error)}`;
      }
      
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
  }
}