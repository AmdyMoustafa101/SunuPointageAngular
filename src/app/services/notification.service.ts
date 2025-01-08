import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new Subject<string>();
  message$ = this.messageSubject.asObservable();

  showMessage(message: string): void {
    this.messageSubject.next(message);
  }

  showSuccess(message: string): void {
    this.showMessage(`Success: ${message}`);
  }

  showError(message: string): void {
    this.showMessage(`Error: ${message}`);
  }
}