import { Component, Input, SimpleChanges } from '@angular/core';
import { UserResponse } from '../../../../core/interfaces/user/user-response';
import { Friend } from '../../../../core/interfaces/user/user-friend';
import { UserFriendService } from '../../../../core/services/user-friend.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AvatarComponent,
    FormsModule,
    InfiniteScrollDirective
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent {

  @Input() currentUserLoggedIn: UserResponse | null = null;
  @Input() currentUsername: string | null = null;
  friends: Friend[] = [];
  openMenuIndex: number | null = null;
  activeTab: 'all' | 'followers' | 'followings' = 'all';
  friendRequests: any[] = [];
  searchResults: any[] = [];
  searchKeyword: string = '';

  // Infinite scroll
  page: number = 0;
  size: number = 2;
  totalPages: number = 0;
  isLoading: boolean = false;
  
  constructor(
    private userFriendService: UserFriendService
  ) { }

  ngOnInit(): void {
    this.resetAndLoad();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentUsername'] && !changes['currentUsername'].firstChange) {
      this.resetAndLoad();
    }
  }

  resetAndLoad() {
    this.page = 0;
    this.friends = [];
    this.getListFriends();
  }

  getListFriends() {
    if (!this.currentUsername) return;
    this.userFriendService.getListFriends(this.currentUsername, this.page, this.size).subscribe({
      next: (response) => {
        debugger
        if (response && response.content && response.totalPages) {
          this.friends = [...this.friends, ...response.content];
          this.totalPages = response.totalPages;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading friends:', error);
        this.isLoading = false;
      }
    });
  }

  loadMore() {
    console.log('Loading more friends...');
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.getListFriends();
    }
  }

  toggleMenu(index: number): void {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  removeFriend(friend: Friend): void {
    const friendToRemove = friend.otherUser;
    if (confirm(`Bạn có chắc muốn xóa ${friendToRemove?.profile?.fullName || 'người này'} khỏi danh sách bạn bè?`)) {
      if(!friendToRemove?.id) return;
      this.userFriendService.unfriend(friendToRemove?.id).subscribe({
        next: () => {
          this.openMenuIndex = null;
          this.friends = this.friends.filter(f => f !== friend);
        },
        error: (error) => {
          console.error('Error removing friend:', error);
        }
      });
    }
  }

  countFriends(): number {
    return this.friends.filter(friend => friend.status === 'accepted').length;
  }

  changeTab(tab: 'all' | 'followers' | 'followings') {
    this.activeTab = tab;
  }

  searchFriends() {
    // if (!this.searchKeyword.trim()) {
    //   this.searchResults = [];
    //   return;
    // }
    // this.userFriendService.searchUsers(this.searchKeyword).subscribe((res) => {
    //   this.searchResults = res;
    // });
  }

  acceptRequest(req: any) {
    // this.userFriendService.acceptRequest(req.id).subscribe(() => {
    //   this.loadFriends();
    // });
  }

  declineRequest(req: any) {
    // this.userFriendService.declineRequest(req.id).subscribe(() => {
    // });
  }

  sendFriendRequest(user: any) {
    this.userFriendService.sendRequest(user.id).subscribe(() => {
      this.searchFriends();
    });
  }
}
