import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApprenantService {
  private apiUrl = 'http://localhost:8002/api/apprenants'; // Remplacez avec l'URL de votre API
  private cohorteUrl = 'http://localhost:8002/api/cohortes';
  private userData: any = null;

  constructor(private http: HttpClient) {}

  createApprenant(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  importApprenants(fileData: FormData): Observable<any> {
    const url = `${this.apiUrl}/import`;
    return this.http.post<any>(url, fileData).pipe(
      catchError(this.handleError)
    );
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

  // Obtenir les apprenants avec pagination, recherche et filtrage
  getApprenants(page: number = 1, search: string = '', cohorteId: number = 0): Observable<any> {
    let params = new HttpParams().set('page', page.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (cohorteId) {
      params = params.set('cohorte_id', cohorteId.toString());
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Obtenir toutes les cohortes pour le filtrage
  getCohortes(): Observable<any> {
    return this.http.get<any>(this.cohorteUrl);
  }

  // Fonction pour récupérer les données utilisateur depuis le localStorage
  getUserData(): any {
    if (this.userData) {
      return this.userData;
    }

    // Si aucune donnée en mémoire, on récupère depuis localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
    }

    return this.userData || null;
  }

  updateApprenant(apprenantId: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${apprenantId}`, updatedData).pipe(
      tap(() => {
        // Enregistrer l'action dans l'historique
        this.enregistrerAction('Modification', 'apprenant', apprenantId).subscribe({
          next: () => console.log('Action enregistrée avec succès'),
          error: (err) => console.error('Erreur lors de l\'enregistrement de l\'action :', err),
        });
      })
    );
  }

  enregistrerAction(action: string, cibleType: string | null = null, cibleId: number | null = null): Observable<any> {
    const utilisateur = this.getUserData(); // Méthode pour récupérer les données utilisateur
    if (!utilisateur) {
      throw new Error('Utilisateur non connecté');
    }

    const data = {
      action,
      utilisateur_id: utilisateur.id,
      cible_id: cibleId || null,
      cible_type: cibleType || null,
    };

    return this.http.post('http://localhost:3005/api/historique', data); // Modifier l'URL si nécessaire
  }

}
