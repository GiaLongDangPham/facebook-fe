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
  friends: Friend[] = []; //Friends của người mình xem trang cá nhân
  totalFriends: number = 0;
  openMenuIndex: number | null = null;
  activeTab: 'all' | 'followers' | 'followings' | 'mutual' = 'all';
  searchKeyword: string = '';
  searchTimeout: any;
  mutualFriends: UserResponse[] = []; // Friends chung của mình và người mình đang xem
  mutualFriendsCount: number = 0;
  // Infinite scroll
  page: number = 0;
  size: number = 20;
  totalPages: number = 0;
  isLoading: boolean = false;
  
  constructor(
    private userFriendService: UserFriendService
  ) { }

  ngOnInit(): void {
    this.resetAndLoad();
    this.getMutualFriends(this.currentUsername);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentUsername'] && !changes['currentUsername'].firstChange) {
      this.resetAndLoad();
      this.getMutualFriends(this.currentUsername);
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
        if (response && response.content && response.totalPages && response.totalElements) {
          debugger
          this.friends = [...this.friends, ...response.content];
          this.totalPages = response.totalPages;
          this.totalFriends = response.totalElements;
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

  getListFriendsByKeyWord() {
    if (!this.currentUsername) return;
    this.userFriendService.getListFriends(this.currentUsername, this.page, this.size, this.searchKeyword).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.friends = [...this.friends, ...response.content];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading friends:', error);
        this.isLoading = false;
      }
    });
  }

  getMutualFriends(usernameParam: string | undefined | null) {
    if (!usernameParam) return;
    debugger
    this.userFriendService.countMutualFriends(usernameParam).subscribe({
      next: (response) => {
        this.mutualFriends = response;
        this.mutualFriendsCount = response.length;
      },
      error: (error) => {
        console.error('Error counting mutual friends:', error);
      }
    });
  }

  // debounce khi gõ
  onSearchChange(text: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page = 0; // reset trang
      this.friends = [];
      this.getListFriendsByKeyWord();
    }, 300); // chờ 300ms để gõ xong
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

  changeTab(tab: 'all' | 'followers' | 'followings' | 'mutual') {
    this.activeTab = tab;
  }
}
