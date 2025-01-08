import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import axios from 'axios'; // Pour appeler l'API Node.js

export interface LogoutResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  private apiUrl = 'http://localhost:8002/api/employes'; // URL de l'API Laravel
  private departementUrl = 'http://localhost:8002/api/departements';
  private userData: any = null;
  private socket: WebSocket | null = null; // WebSocket instance
  private socketMessages$ = new Subject<any>(); // Observable pour les messages du WebSocket
  private isLoginPage: boolean = false;

  constructor(private http: HttpClient) {}

  setLoginPageState(state: boolean): void {
    this.isLoginPage = state;
}

  // Méthodes HTTP existantes
  createEmploye(employeData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, employeData);
  }

  getDepartements(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8002/api/departements');
  }

  getEmployes(params: any): Observable<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.http.get(`${this.apiUrl}?${queryString}`);
  }

  updateEmploye(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }



  updatePhoto(userId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/update-photo`, formData);
  }

  changePassword(userId: number, currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}/change-password1`;
    const body = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }



  importEmployes(fileData: FormData): Observable<any> {
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

  login(email: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:8002/api/login`, { email, password });
  }

  // Ajout dans EmployeService
  loginByCard(rfidCardId: string): Observable<any> {
  return this.http.post(`http://localhost:8002/api/login-by-card`, { cardID: rfidCardId });
}

  // Fonction de logout
  logout(): Observable<any> {
    return this.http.post(`http://localhost:8002/api/logout`, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
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

  // Fonction pour sauvegarder les données utilisateur dans le localStorage
  setUserData(user: any): void {
    this.userData = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Fonction pour sauvegarder le token dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Fonction pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Fonction pour effacer le token et les données utilisateur du localStorage
  clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  enregistrerAction(action: string, cibleType: string | null = null, cibleId: number | null = null): Observable<any> {
    // Récupérer les données de l'utilisateur connecté depuis le localStorage
    const utilisateur = this.getUserData();
    if (!utilisateur) {
      throw new Error('Utilisateur non connecté');
    }

    // Préparer les données de l'action
    const data = {
      action,
      utilisateur_id: utilisateur.id, // ID de l'utilisateur connecté
      cible_id: cibleId || null,
      cible_type: cibleType || null,
    };

    // Appeler l'API Node.js pour enregistrer l'action
    return this.http.post('http://localhost:3005/api/historique', data); // Adaptez l'URL si nécessaire
  }

  updateEmploye1(employeId: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${employeId}`, updatedData).pipe(
      tap(() => {
        // Enregistrer l'action dans la collection historiqueactions
        this.enregistrerAction('Modification', 'employe', employeId).subscribe({
          next: () => console.log('Action enregistrée avec succès'),
          error: (err) => console.error('Erreur lors de l\'enregistrement de l\'action:', err),
        });
      })
    );
  }





  // Intégration WebSocket


  // Envoyer un message via WebSocket
  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket non connecté. Le message n\'a pas été envoyé.');
    }
  }

  // Initialisation du WebSocket
  initializeWebSocket() {
    this.socket = new WebSocket('ws://localhost:3004');

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.cardID) { // Ajout d'une vérification
          this.socketMessages$.next({ type: 'card', cardID: message.cardID });
      } else if (message.mode) {
          this.socketMessages$.next({ type: 'mode', mode: message.mode });
      }
  };

    this.socket.onerror = (error) => {
        console.error('Erreur WebSocket :', error);
    };

    this.socket.onclose = () => {
        console.warn('WebSocket déconnecté.');
    };
}


  getWebSocketMessages(): Observable<any> {
    return this.socketMessages$.asObservable();
  }

}
