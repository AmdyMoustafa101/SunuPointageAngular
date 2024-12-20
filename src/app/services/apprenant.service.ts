import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprenantService {
  private apiUrl = 'http://localhost:8002/api/apprenants'; // Remplacez avec l'URL de votre API

  constructor(private http: HttpClient) {}

  createApprenant(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
