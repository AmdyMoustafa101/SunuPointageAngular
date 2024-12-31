import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import axios from 'axios'; // Pour appeler l'API Node.js

export interface LogoutResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  private apiUrl = 'http://localhost:8002/api/employes'; // URL de l'API Laravel
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

  login(email: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:8002/api/login`, { email, password });
  }

  // Ajout dans EmployeService
  loginByCard(rfidCardId: string): Observable<any> {
  return this.http.post(`http://localhost:8002/api/login-by-card`, { cardID: rfidCardId });
}


  // Stockage des données utilisateur
  setUserData(user: any): void {
    this.userData = user;
  }

  getUserData(): any {
    return this.userData;
  }

  // Fonction de logout
  logout(): Observable<any> {
    return this.http.post(`http://localhost:8002/api/logout`, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
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
