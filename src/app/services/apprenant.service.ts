// src/app/services/apprenant.service.ts
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Apprenant, ApprenantStats, ApprenantFormData, PaginatedResponse } from '../models/apprenant.model';



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

        // Archiver un apprenant spécifique
        archiverApprenant(id: number): Observable<any> {
            return this.http.post(`${this.apiUrl}/apprenants/${id}/archive`, {}).pipe(
            catchError(this.handleError)
            );
        }
    
      // Archiver plusieurs apprenants
        archiverApprenants(ids: number[]): Observable<any> {
            return this.http.post(`${this.apiUrl}/apprenants/archive`, { ids }).pipe(
            catchError(this.handleError)
            );
        }
      
       // Récupérer les apprenants actifs par cohorte
        getApprenantsActifsByCohorte(id: number): Observable<Apprenant[]> {
            return this.http.get<Apprenant[]>(`${this.apiUrl}/cohortes/${id}/apprenants-actifs`).pipe(
            catchError(this.handleError)
            );
        }

        // Récupérer les apprenants archivés par cohorte
        getApprenantsArchivesByCohorte(id: number): Observable<Apprenant[]> {
            return this.http.get<Apprenant[]>(`${this.apiUrl}/cohortes/${id}/apprenants-archives`).pipe(
            catchError(this.handleError)
            );
        }

        // Désarchiver un apprenant spécifique
        desarchiverApprenant(id: number): Observable<any> {
            return this.http.post(`${this.apiUrl}/apprenants/${id}/desarchive`, {}).pipe(
            catchError(this.handleError)
            );
        }

        desarchiverApprenants(ids: number[]): Observable<any> {
            return this.http.post(`${this.apiUrl}/apprenants/desarchive`, { ids }).pipe(
              catchError(this.handleError)
            );
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