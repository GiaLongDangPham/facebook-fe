import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../../core/interfaces/user/user-response';
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
}
