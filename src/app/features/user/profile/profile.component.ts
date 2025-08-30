import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostComponent } from '../post/post.component';
import { CommonModule } from '@angular/common';
import { UserResponse } from '../../../core/interfaces/user/user-response';
import { UserService } from '../../../core/services/user.service';
import { UserProfileResponse } from '../../../core/interfaces/user/user-profile-response';
import { ProfileService } from '../../../core/services/profile.service';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { ProfilePhotosComponent } from './profile-photos/profile-photos.component';
import { AvatarComponent } from './avatar/avatar.component';
import { FriendsComponent } from './friends/friends.component';
import { Friend } from '../../../core/interfaces/user/user-friend';
import { UserFriendService } from '../../../core/services/user-friend.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PostComponent,
    CommonModule,
    EditProfileModalComponent,
    ProfileAboutComponent,
    ProfilePhotosComponent,
    AvatarComponent,
    FriendsComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profile?: UserProfileResponse;
  isOwner = false;
  activeTab: 'posts' | 'about' | 'photos' | 'friends' = 'posts';
  currentUser: UserResponse | null = null;
  currentUsername: string | null = null; // Username của người mình vô trang cá nhân
  viewedUser: UserResponse | null = null; // User mà mình vô trang cá nhân
  showEditModal = false;
  friends: Friend[] = [];
  friendStatus: 'accepted' | 'pending' | 'waiting' | 'none' = 'none';
  isDropdownOpen = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private userFriendService: UserFriendService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUserResponseFromLocalStorage();
    // Subscribe paramMap để load profile mỗi khi id thay đổi
    this.route.paramMap.subscribe(params => {
      this.currentUsername = params.get('username');
      this.loadViewedUser();
      this.getListFriends();
      this.getProfile();
      this.isOwner = (this.currentUsername === this.currentUser?.profile?.username) ? true : false;
    });
  }

  
  loadViewedUser() {
    if (!this.currentUsername) return;
    this.userService.getUserByUsername(this.currentUsername).subscribe({
      next: (res: UserResponse) => {
        this.viewedUser = res;
      },
      error: (err) => {
        console.error('Error loading user:', err);
      }
    });
  }

  getProfile() {
    if (this.currentUsername) {
      this.profileService.getProfile(this.currentUsername).subscribe({
        next: (profile) => {
          this.profile = profile;
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
        }
      });
    }
  }

  getListFriends() {
    if (!this.currentUser || !this.currentUser.profile.username) return;
    this.userFriendService.getListFriends(this.currentUser.profile.username, 0, 10).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.friends = response.content;
          debugger
          // Tìm trong danh sách bạn bè xem có phải là viewedUser không
          const relation = this.friends.find(friend => friend.otherUser?.id === this.viewedUser?.id);
          this.friendStatus = relation ? relation.status : 'none';
        }
      },
      error: (error) => {
        console.error('Error loading friends:', error);
      }
    });
  }

  sendFriendRequest() {
    if (!this.currentUser || !this.viewedUser) return;
    debugger
    this.userFriendService.sendRequest(this.viewedUser!.id).subscribe({
      next: (response: Friend) => {
        this.toastr.success('Gửi lời mời kết bạn thành công');
        this.friendStatus = 'pending';
      },
      error: (error) => {
        console.error('Error sending friend request:', error);
      }
    });
  }

  cancelFriendRequest() {
    if (!this.currentUser || !this.viewedUser) return;
    this.userFriendService.cancelRequest(this.viewedUser!.id).subscribe({
      next: (response) => {
        this.toastr.success('Đã hủy lời mời kết bạn');
        this.friendStatus = 'none';
      },
      error: (error) => {
        console.error('Error canceling friend request:', error);
      }
    });
  }

  acceptFriendRequest() {
    if (!this.currentUser || !this.viewedUser) return;
    this.userFriendService.accept(this.viewedUser!.id).subscribe({
      next: (response: Friend) => {
        this.toastr.success('Đã là bạn bè');
        this.friendStatus = 'accepted';
      },
      error: (error) => {
        console.error('Error accepting friend request:', error);
      }
    });
  }

  removeFriendRequest() {
    if (!this.currentUser || !this.viewedUser) return;
    this.userFriendService.reject(this.viewedUser!.id).subscribe({
      next: (response) => {
        this.toastr.success('Đã hủy lời mời kết bạn');
        this.friendStatus = 'none';
      },
      error: (error) => {
        console.error('Error removing friend request:', error);
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  addToFavorites() {
    console.log("Thêm vào yêu thích");
    this.isDropdownOpen = false;
  }

  unfriend() {
    if (confirm("Bạn có chắc chắn muốn xóa bạn?")) {
      this.userFriendService.unfriend(this.viewedUser!.id).subscribe({
        next: (response) => {
          this.toastr.success('Đã xóa bạn');
          this.friendStatus = 'none';
        },
        error: (error) => {
          console.error('Error removing friend:', error);
        }
      });
    }
    this.isDropdownOpen = false;
  }

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveProfile(updated: UserProfileResponse) {
    this.profile = updated;
    this.showEditModal = false;
    this.profileService.updateProfile(this.currentUser!.id, this.profile!).subscribe({
      next: (response) => {
        this.toastr.success('Cập nhật thông tin thành công');
        console.log('Profile updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      }
    });
  }
}
