import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  private apiUrl = 'http://localhost:8002/api/leave-requests';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Handle the error here, e.g., log it or transform the error message
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(error); // Propagate the error back to the component
  }

  getLeaveRequests(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getLeaveRequest(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createLeaveRequest(leaveRequest: any): Observable<any> {
    return this.http.post(this.apiUrl, leaveRequest).pipe(
      catchError(this.handleError)
    );
  }

  updateLeaveRequest(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  deleteLeaveRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getPendingLeaveRequestsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/pending/count`).pipe(
      catchError(this.handleError)
    );
  }
}