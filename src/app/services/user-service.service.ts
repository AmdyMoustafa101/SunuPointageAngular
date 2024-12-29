import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8002/api';

  constructor(private http: HttpClient) {}

  getEmployes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employesC`);
  }

  getApprenants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/apprenantsC`);
  }

  assignCard(userId: number, userType: string, cardID: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-card`, { user_id: userId, user_type: userType, cardID });
  }
}
