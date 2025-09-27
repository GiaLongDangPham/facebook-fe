import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserProfileResponse } from '../../../../core/interfaces/user/user-profile-response';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../../core/services/file.service';
import { UserResponse } from '../../../../core/interfaces/user/user-response';
import { forkJoin, tap } from 'rxjs';
import { AvatarComponent } from '../../../../shared/avatar/avatar.component';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    AvatarComponent
  ],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.scss'
})
export class EditProfileModalComponent {

  @Input() currentUser: UserResponse | null = null;
  @Input() profile?: UserProfileResponse;
  @Output() save = new EventEmitter<UserProfileResponse>();
  @Output() close = new EventEmitter<void>();

  selectedAvatar: File | null = null;
  previewUrl: string | null = null;

  selectedCoverUrl: File | null = null;
  coverPreviewUrl: string | null = null;

  editedProfile: UserProfileResponse = {
    userId: '',
    username: '',
    fullName: '',
    avatarUrl: '',
    coverUrl: '',
    bio: '',
    gender: '',
    dob: '',
    location: '',
    website: ''
  };

  constructor(
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.editedProfile = { ...this.profile }; // clone dữ liệu
  }

  onSave() {
    const uploadTasks = [];

    if (this.selectedAvatar) {
      uploadTasks.push(
        this.fileService.uploadFile(this.selectedAvatar).pipe(
          tap(res => this.editedProfile.avatarUrl = res.url)
        )
      );
    }

    if (this.selectedCoverUrl) {
      uploadTasks.push(
        this.fileService.uploadFile(this.selectedCoverUrl).pipe(
          tap(res => this.editedProfile.coverUrl = res.url)
        )
      );
    }

    if (uploadTasks.length > 0) {
      forkJoin(uploadTasks).subscribe({
        next: () => {
          this.save.emit(this.editedProfile);
        },
        error: (err) => {
          console.error('Error uploading files:', err);
          alert('Upload ảnh thất bại');
        }
      });
    } else {
      this.save.emit(this.editedProfile);
    }
  }

  onClose() {
    this.close.emit();
  }

  onCoverUrlSelected(event: Event) {
    debugger
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      this.selectedCoverUrl = file;
      this.coverPreviewUrl = URL.createObjectURL(file); // Hiển thị preview
    }
  }

  onAvatarSelected(event: Event) {
    debugger
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      this.selectedAvatar = file;
      this.previewUrl = URL.createObjectURL(file); // Hiển thị preview
    }
  }
}
