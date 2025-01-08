import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <div *ngIf="message" class="notification">
      {{ message }}
      <button (click)="clearMessage()">X</button>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #28a745;
      color: white;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class NotificationComponent {
  message: string | null = null;

  constructor(private notificationService: NotificationService) {
    this.notificationService.message$.subscribe(msg => {
      this.message = msg;
      setTimeout(() => this.clearMessage(), 3000); // Supprime le message après 3 secondes
    });
  }

  clearMessage() {
    this.message = null;
  }
}