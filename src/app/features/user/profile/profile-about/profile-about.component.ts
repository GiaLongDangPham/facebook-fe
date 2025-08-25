import { Component, Input } from '@angular/core';
import { UserProfileResponse } from '../../../../core/interfaces/user/user-profile-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-about',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile-about.component.html',
  styleUrl: './profile-about.component.scss'
})
export class ProfileAboutComponent {
  @Input() profile?: UserProfileResponse;
}
