import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionEnum, NotificationResponse, StateEnum } from '../../../../core/interfaces/notification';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../profile/avatar/avatar.component';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserFriendService } from '../../../../core/services/user-friend.service';
import { is } from 'date-fns/locale';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    TimeAgoPipe,
  ],
  templateUrl: './notification-detail.component.html',
  styleUrl: './notification-detail.component.scss'
})
export class NotificationDetailComponent {

  @Input() noti!: NotificationResponse;
  @Output() showNoti: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteNoti: EventEmitter<string> = new EventEmitter<string>();
  ActionEnum = ActionEnum;
  StateEnum = StateEnum;
  showDropdown: boolean = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private userFriendService: UserFriendService
  ) {}

  goTo(noti: NotificationResponse) { 
    const extras: any = {};
    if (noti.actionPerformedId) {
      extras.queryParams = { highlightComment: noti.actionPerformedId };
    }

    this.router.navigate([noti.redirectURL], extras);

    if (noti.state !== StateEnum.SEEN_AND_READ) {
      this.notificationService.updateNotificationState(
        noti.targetId, noti.actionType, noti.recipientId, StateEnum.SEEN_AND_READ
      ).subscribe(() => {
        noti.state = StateEnum.SEEN_AND_READ;
      });
    }

    this.showNoti.emit(false);
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation(); // tránh trigger click goTo(noti)
    this.showDropdown = !this.showDropdown;
  }

  deleteNotification(notiId: string) {
    console.log("Delete noti:", notiId);
    this.showDropdown = false;
    // TODO: Gọi NotificationService để xóa noti
    this.notificationService.deleteById(notiId).subscribe({
      next: () => {
        console.log("Noti deleted successfully");
        this.deleteNoti.emit(notiId);
      },
      error: (error) => {
        console.error("Error deleting noti:", error);
      }
    });
  }

  acceptFriendRequest(requesterId: string) {
    debugger
    this.userFriendService.accept(requesterId).subscribe({
      next: () => {
      },
      error: (error) => {
      }
    });
  }

  rejectFriendRequest(requesterId: string) {
    this.userFriendService.reject(requesterId).subscribe({
      next: () => {
      },
      error: (error) => {
      }
    });
  }
}
