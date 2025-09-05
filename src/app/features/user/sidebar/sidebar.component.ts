import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../core/interfaces/user/user-response';
import { AvatarComponent } from '../profile/avatar/avatar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  @Input() currentUser: UserResponse | null = null;


  get displayName(): string {
    const name = this.currentUser?.profile?.fullName || '';
    return name.length > 15 ? name.slice(0, 15) + '...' : name;
  }
}
