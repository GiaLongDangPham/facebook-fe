import { Component, Input } from '@angular/core';
import { UserProfileResponse } from '../../../../core/interfaces/user/user-profile-response';
import { UserPhotoService } from '../../../../core/services/user-photo.service';
import { CommonModule } from '@angular/common';
import { Photo } from '../../../../core/interfaces/user/photo';

@Component({
  selector: 'app-profile-photos',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile-photos.component.html',
  styleUrl: './profile-photos.component.scss'
})
export class ProfilePhotosComponent {
  @Input() profile?: UserProfileResponse;
  photos: Photo[] = [];

  // Lightbox
  showLightbox = false;
  currentIndex = 0;

  showMenu = false;

  constructor(
    private userPhotoService: UserPhotoService
  ) { }

  ngOnInit(): void {
    if (this.profile && this.profile.userId) {
      this.userPhotoService.getUserPhotos(this.profile.userId).subscribe({
        next: (photos) => {
          this.photos = photos;
        },
        error: (error) => {
          console.error('Error fetching user photos:', error);
        }
      });
    }
  }

  trackByFn(index: number, photo: Photo) {
    return photo.id;
  }

  openLightbox(index: number) {
    this.currentIndex = index;
    this.showLightbox = true;
  }

  closeLightbox() {
    this.showLightbox = false;
  }

  prevPhoto() {
    if (this.photos.length > 0) {
      this.currentIndex = this.currentIndex - 1;
    }
  }

  nextPhoto() {
    if (this.photos.length > 0 && this.currentIndex < this.photos.length - 1) {
      this.currentIndex = this.currentIndex + 1;
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  deletePhoto(photoId: string | undefined) {
    if (!photoId) return;

    this.userPhotoService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos = this.photos.filter(photo => photo.id !== photoId);
        window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting photo:', error);
      }
    });
  }
}