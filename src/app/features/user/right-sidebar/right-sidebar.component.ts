import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../core/interfaces/user/user-response';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../profile/avatar/avatar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    RouterModule
  ],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss'
})
export class RightSidebarComponent {
  @Input() currentUser: UserResponse | null = null;


  get displayName(): string {
    const name = this.currentUser?.profile?.fullName || '';
    return name.length > 15 ? name.slice(0, 15) + '...' : name;
  }
}
