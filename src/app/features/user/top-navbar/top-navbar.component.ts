import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../core/interfaces/user/user-response';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { TokenService } from '../../../core/services/token.service';
import { AuthService } from '../../../core/services/auth.service';
import { LogoutRequest } from '../../../core/interfaces/auth/logout-request';
import { AvatarComponent } from '../profile/avatar/avatar.component';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationResponse, StateEnum } from '../../../core/interfaces/notification';
import { Subscription } from 'rxjs';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    AvatarComponent,
    NotificationComponent
  ],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss'
})
export class TopNavbarComponent {

  @Input() currentUser: UserResponse | null = null;
  showNoti = false;
  showUserMenu = false;
  notifications: NotificationResponse[] = [];
  unseenCount = 0;
  private notificationSub!: Subscription;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.connectToWebSocket();
    this.getNotiWithin30days();
    this.getUnseenCount();
  }

  ngOnDestroy() {
    this.notificationSub?.unsubscribe();
    this.notificationService.disconnect();
  }

  connectToWebSocket() {
    if (!this.currentUser?.id) return;
    this.notificationService.connect(this.currentUser?.id);
    this.notificationSub = this.notificationService.notifications$.subscribe((noti: NotificationResponse | null) => {
      debugger
      if (noti) {
        this.notifications = [noti, ...this.notifications];
        this.unseenCount = this.notifications.filter(n => n.state === 'UNSEEN').length;
      }
    });
  }

  getNotiWithin30days() {
    if (this.currentUser?.id) {
      this.notificationService.getNotiWithin30days(this.currentUser.id).subscribe({
        next: (response) => {
          this.notifications = response;
        },
        error: (error) => {
          console.error('Error fetching notifications within 30 days:', error);
        }
      });
    }
  }

  getUnseenCount() {
    if (this.currentUser?.id) {
      this.notificationService.getUnseenCount(this.currentUser.id).subscribe({
        next: (response) => {
          this.unseenCount = response.countUnseen;
        },
        error: (error) => {
          console.error('Error fetching unseen count:', error);
        }
      });
    }
  }

  toggleNoti() {
    this.showNoti = !this.showNoti;
    this.showUserMenu = false;
    if (this.showNoti && this.unseenCount != 0) {
      this.notificationService.markAllSeen().subscribe(() => {
        this.notifications.forEach(n => {
          if (n.state === StateEnum.UNSEEN) {
            n.state = StateEnum.SEEN;
          }
        });
        this.unseenCount = 0;
      });
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNoti = false;
  }

  logout() {
    const accessToken = this.tokenService.getToken();
    this.authService.logout({ accessToken } as LogoutRequest).subscribe({
      next: () => {
        this.userService.removeUserFromLocalStorage();
        this.tokenService.removeToken();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
