import { Component } from '@angular/core';
import { UserResponse } from '../../../../core/interfaces/user/user-response';
import { UserService } from '../../../../core/services/user.service';
import { UserFriendService } from '../../../../core/services/user-friend.service';
import { Friend } from '../../../../core/interfaces/user/user-friend';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../profile/avatar/avatar.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-friend-requests',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    InfiniteScrollDirective,
    RouterModule
  ],
  templateUrl: './friend-requests.component.html',
  styleUrl: './friend-requests.component.scss'
})
export class FriendRequestsComponent {
  currentUser: UserResponse | null = null;
  friendRequests: Friend[] = [];

  // Infinite Scroll
  page = 0;
  size = 20;
  totalPages = 0;
  isLoading = false;

  constructor(
    private userService: UserService,
    private userFriendService: UserFriendService
  ) { }

  ngOnInit(): void {
    // Load current user data
    this.currentUser = this.userService.getUserResponseFromLocalStorage();
    this.resetAndLoad();
  }

  loadFriendRequests(): void {
    if (this.currentUser) {
      this.userFriendService.getFriendRequests(this.currentUser.id, this.page, this.size).subscribe({
        next: (response) => {
          if (response && response.content) {
            this.friendRequests = [...this.friendRequests, ...response.content];
            this.totalPages = response.totalPages;
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error loading friend requests:', error);
          this.isLoading = false;
        }
      });
    }
  }

  resetAndLoad() {
    this.page = 0;
    this.friendRequests = [];
    this.loadFriendRequests();
  }

  
  loadMore() {
    debugger
    console.log('Scrolled!! page loadFriendRequests:', this.page, 'total:', this.totalPages);
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadFriendRequests();
    }
  }

  acceptFriend(friendId?: string): void {
    if (!friendId) return;
    this.userFriendService.accept(friendId).subscribe({
      next: () => {
        this.friendRequests = this.friendRequests.filter(f => f.otherUser?.id !== friendId);
      },
      error: (error) => console.error('Error accepting friend request:', error)
    });
  }

  deleteFriend(friendId?: string): void {
    if (!friendId) return;
    this.userFriendService.reject(friendId).subscribe({
      next: () => {
        this.friendRequests = this.friendRequests.filter(f => f.otherUser?.id !== friendId);
      },
      error: (error) => console.error('Error rejecting friend request:', error)
    });
  }

  getDisplayName(friend: Friend): string {
    return friend.otherUser?.profile.fullName || 'Unknown';
  }
}
 