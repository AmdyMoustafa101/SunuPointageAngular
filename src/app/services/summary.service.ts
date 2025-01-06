import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private empDeptUrl = 'http://127.0.0.1:8002/api/Emp-dept';
  private appCohorteUrl = 'http://127.0.0.1:8002/api/App-cohorte';

  constructor(private http: HttpClient) {}

  // Récupérer les données des employés et départements
  getEmpDept(): Observable<any> {
    return this.http.get(this.empDeptUrl);
  }

  // Récupérer les données des apprenants et cohortes
  getAppCohorte(): Observable<any> {
    return this.http.get(this.appCohorteUrl);
  }

  // Récupérer toutes les données en parallèle
  getAllData(): Observable<any> {
    return forkJoin({
      empDept: this.getEmpDept(),
      appCohorte: this.getAppCohorte(),
    });
  }
}
