import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {

  @Input() avatarUrl?: string;
  @Input() width: number = 40;   // default 40px
  @Input() height: number = 40;  // default 40px
  @Input() customClass: string = ''; // thêm class riêng
  @Input() previewUrl: string | null = null;
  @Input() isOnline: boolean = false;
  @Input() lastOffline?: number; // timestamp (ms)

  getOfflineTime(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '1 phút';
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ`;
    const days = Math.floor(hours / 24);
    return `${days} ngày`;
  }
}
