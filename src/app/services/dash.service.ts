import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = 'http://127.0.0.1:3000/his/weekly'; 

  constructor(private http: HttpClient) {}

  getWeeklyData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getDailyData(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:3000/his/daily'); 
  }
  
}
