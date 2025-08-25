import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostComponent } from '../post/post.component';
import { CommonModule } from '@angular/common';
import { UserResponse } from '../../../core/interfaces/user-response';
import { UserService } from '../../../core/services/user.service';
import { UserProfileResponse } from '../../../core/interfaces/user-profile-response';
import { ProfileService } from '../../../core/services/profile.service';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { ProfilePhotosComponent } from './profile-photos/profile-photos.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PostComponent,
    CommonModule,
    EditProfileModalComponent,
    ProfileAboutComponent,
    ProfilePhotosComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profile?: UserProfileResponse;
  isOwner = false;
  activeTab: 'posts' | 'about' | 'photos' = 'posts';
  currentUser: UserResponse | null = null;

  showEditModal = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUserResponseFromLocalStorage();

    // Subscribe paramMap để load profile mỗi khi id thay đổi
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username === this.currentUser?.profile?.username) {
        this.isOwner = true;
      } else {
        this.isOwner = false;
      }

      if (username) {
        this.profileService.getProfile(username).subscribe({
          next: (profile) => {
            this.profile = profile;
          },
          error: (error) => {
            console.error('Error fetching profile:', error);
          }
        });
      }
    });
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
