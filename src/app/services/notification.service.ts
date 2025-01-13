import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showSuccess(arg0: string) {
    throw new Error('Method not implemented.');
  }
  private notificationCount = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCount.asObservable();

  incrementNotificationCount() {
    this.notificationCount.next(this.notificationCount.value + 1);
  }
}