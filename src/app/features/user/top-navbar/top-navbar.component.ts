import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../core/interfaces/user/user-response';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { TokenService } from '../../../core/services/token.service';
import { AuthService } from '../../../core/services/auth.service';
import { LogoutRequest } from '../../../core/interfaces/auth/logout-request';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationResponse, StateEnum } from '../../../core/interfaces/notification';
import { Subscription } from 'rxjs';
import { NotificationComponent } from '../notification/notification.component';
import { UserFriendService } from '../../../core/services/user-friend.service';
import { PopupChatComponent } from '../popup-chat/popup-chat.component';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    AvatarComponent,
    NotificationComponent,
    PopupChatComponent
  ],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss'
})
export class TopNavbarComponent {

  @Input() currentUser: UserResponse | null = null;
  showNoti = false;
  showUserMenu = false;
  notifications: NotificationResponse[] = [];
  unseenCountNoti = 0;
  private notificationSub!: Subscription;
  // online users 
  allFriends: UserResponse[] = [];
  activeUsers: UserResponse[] = [];
  unseenCountMessages = 0;
  showMessages = false;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private userFriendService: UserFriendService,
  ) {}

  ngOnInit() {
    this.connectToWebSocketNoti();
    this.getNotiWithin30days();
    this.getUnseenCount();
    this.getAllFriends();
    this.userService.getActiveUsers().subscribe(users => {
      debugger
      this.activeUsers = users;
    });
  }

  ngOnDestroy() {
    this.notificationSub?.unsubscribe();
    this.notificationService.disconnect();
  }

  connectToWebSocketNoti() {
    if (!this.currentUser?.id) return;
    this.notificationService.connect(this.currentUser?.id);
    this.notificationSub = this.notificationService.notifications$.subscribe((noti: NotificationResponse | null) => {
      debugger
      if (noti) {
        this.notifications = [noti, ...this.notifications];
        this.unseenCountNoti = this.notifications.filter(n => n.state === 'UNSEEN').length;
      }
    });
  }

  getAllFriends() {
    if (this.currentUser?.id) {
      this.userFriendService.getListFriends(this.currentUser.profile.username!, 0, 10).subscribe({
        next: (friends) => {
          this.allFriends = (friends.content?.map(f => f.otherUser).filter((u): u is UserResponse => u !== undefined)) || [];
        },
        error: (error) => {
          console.error('Error fetching friends:', error);
        }
      });
    }
  }

  toggleMessages() {
    this.showMessages = !this.showMessages;
    this.showUserMenu = false;
    this.showNoti = false;
  }

  isUserOnline(userId: string): boolean {
    return this.activeUsers.some(u => u.id === userId);
  }

  getOfflineTime(lastOffline: number): string {
    debugger
    if (!lastOffline) return '';
    const diffMs = Date.now() - lastOffline;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 60) return `Offline 1 phút trước`;
    if (diffMin < 60) return `Offline ${diffMin} phút trước`;
    if (diffHour < 24) return `Offline ${diffHour} giờ trước`;
    return `Offline ${Math.floor(diffHour / 24)} ngày trước`;
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
          this.unseenCountNoti = response.countUnseen;
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
    this.showMessages = false;
    if (this.showNoti && this.unseenCountNoti != 0) {
      this.notificationService.markAllSeen().subscribe(() => {
        this.notifications.forEach(n => {
          if (n.state === StateEnum.UNSEEN) {
            n.state = StateEnum.SEEN;
          }
        });
        this.unseenCountNoti = 0;
      });
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNoti = false;
    this.showMessages = false;
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


  openChats: UserResponse[] = [];      // tối đa 3 popup
  collapsedChats: UserResponse[] = []; // những cái bị thu gọn
  
  openConversation(friend: UserResponse) {
    this.showMessages = false;

    // kiểm tra nếu đã mở rồi thì thôi
    const exists = this.openChats.find(c => c.id === friend.id);
    if (exists) return;

    if (this.openChats.length < 3) {
      // chưa đủ 3 thì thêm thẳng
      this.openChats.push(friend);
    } else {
      // đủ 3 thì bỏ cái đầu tiên, rồi thêm cái mới
      const removed = this.openChats.shift();
      this.collapsedChats.push(removed!);
      this.openChats.push(friend);
    }
  }


  closeConversation(friend: UserResponse) {
    this.openChats = this.openChats.filter(c => c.id !== friend.id);
    this.collapsedChats = this.collapsedChats.filter(c => c.id !== friend.id);
  }

  expandConversation(friend: UserResponse) {
    // Nếu đang đủ 3 popup thì đóng cái đầu tiên
    if (this.openChats.length >= 3) {
      const removed = this.openChats.shift(); // bỏ cái đầu tiên
      if (removed) {
        this.collapsedChats.push(removed);
      }
    }

    // Xóa khỏi collapsed rồi push vào openChats
    this.collapsedChats = this.collapsedChats.filter(c => c.id !== friend.id);
    this.openChats.push(friend);
  }
}
