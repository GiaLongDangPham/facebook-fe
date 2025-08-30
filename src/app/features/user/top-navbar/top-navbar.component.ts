import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../core/interfaces/user/user-response';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { TokenService } from '../../../core/services/token.service';
import { AuthService } from '../../../core/services/auth.service';
import { LogoutRequest } from '../../../core/interfaces/auth/logout-request';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
  ],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss'
})
export class TopNavbarComponent {

  @Input() currentUser: UserResponse | null = null;

  
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService
  ) {}

  logout() {
    const accessToken = this.tokenService.getToken();
    this.authService.logout({ accessToken } as LogoutRequest).subscribe({
      next: () => {
        this.userService.removeUserFromLocalStorage();
        this.tokenService.removeToken();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
