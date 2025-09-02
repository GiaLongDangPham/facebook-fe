import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationResponse } from '../../../core/interfaces/notification';
import { CommonModule } from '@angular/common';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    NotificationDetailComponent
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  @Input() notifications: NotificationResponse[] = [];
  @Output() showNoti: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  
  showNotification(isShow: boolean) {
    this.showNoti.emit(isShow);
  }

  deleteNotification(notiId: string) {
    this.notifications = this.notifications.filter(noti => noti.id !== notiId);
  }

}
