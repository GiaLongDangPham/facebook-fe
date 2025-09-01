import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionEnum, NotificationResponse, StateEnum } from '../../../core/interfaces/notification';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../profile/avatar/avatar.component';
import { TimeAgoPipe } from '../../../core/pipes/time-ago.pipe';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    TimeAgoPipe
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  @Input() notifications: NotificationResponse[] = [];
  @Output() showNoti: EventEmitter<boolean> = new EventEmitter<boolean>();
  ActionEnum = ActionEnum;
  StateEnum = StateEnum;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  goTo(noti: NotificationResponse) { 
    this.router.navigateByUrl(noti.redirectURL);
    this.notificationService.updateNotificationState(
      noti.targetId, noti.actionType, StateEnum.SEEN_AND_READ
    ).subscribe(() => {
      noti.state = StateEnum.SEEN_AND_READ;
    });
    this.showNoti.emit(false);
  }
}
