import { Component } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { UserResponse } from '../../core/interfaces/user/user-response';
import { UserService } from '../../core/services/user.service';
import { TokenService } from '../../core/services/token.service';
import { AuthService } from '../../core/services/auth.service';
import { LogoutRequest } from '../../core/interfaces/auth/logout-request';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  currentUser: UserResponse | null = null;
  
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUserResponseFromLocalStorage();
  }

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

  get displayName(): string {
    debugger
    const name = this.currentUser?.profile?.fullName || this.currentUser?.profile?.username || '';
    return name.length > 15 ? name.slice(0, 15) + '...' : name;
  }
}
