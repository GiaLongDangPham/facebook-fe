import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserProfileResponse } from '../../../../core/interfaces/user/user-profile-response';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../../core/services/file.service';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.scss'
})
export class EditProfileModalComponent {

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
    this.save.emit(this.editedProfile);
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

  uploadCoverUrl() {
    debugger
    if (!this.selectedCoverUrl) return;

    this.fileService.uploadFile(this.selectedCoverUrl).subscribe({
      next: (res) => {
        this.editedProfile = { ...this.profile }; // clone dữ liệu
        this.editedProfile.coverUrl = res.url;
        this.save.emit(this.editedProfile);
        debugger
      },
      error: (err) => {
        debugger
        console.error('Error uploading cover:', err);
        alert('Upload ảnh thất bại');
      }
    });
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

  uploadAvatar() {
    debugger
    if (!this.selectedAvatar) return;

    this.fileService.uploadFile(this.selectedAvatar).subscribe({
      next: (res) => {
        this.editedProfile = { ...this.profile }; // clone dữ liệu
        this.editedProfile.avatarUrl = res.url;
        this.save.emit(this.editedProfile);
        debugger
      },
      error: (err) => {
        debugger
        console.error('Error uploading avatar:', err);
        alert('Upload ảnh thất bại');
      }
    });
  }
}
