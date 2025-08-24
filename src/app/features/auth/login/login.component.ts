import { Component } from '@angular/core';
import { LoginRequest } from '../../../core/interfaces/login-request';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse } from '../../../core/interfaces/auth-response';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../../core/services/token.service';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  user: LoginRequest = {
    email: 'a@gmail.com',
    password: '123'
  };
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  login() {
    if (!this.user.email || !this.user.password) {
      this.toastr.error('Email and password are required', 'Login Error');
      return;
    }
    this.authService.login(this.user).subscribe({
      next: (response: AuthResponse) => {
        debugger
        // Save the token and user response
        this.tokenService.setToken(response.accessToken);
        this.userService.saveUserResponseToLocalStorage(response.userResponse);

        this.toastr.success('Login successful', 'Success');
        this.router.navigate(['/user']);
      },
      error: (error) => {
        debugger
        console.error('Login error:', error);
        this.toastr.error('Sai email hoặc mật khẩu', 'Lỗi');
      }
    });
  }

  togglePassword() {
  this.showPassword = !this.showPassword;
}

}
