import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LogoutRequest } from '../../../core/interfaces/logout-request';
import { RegisterRequest } from '../../../core/interfaces/register-request';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  user: RegisterRequest = {
    email: '',
    password: '',
    username: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  register() {
    if (!this.user.email || !this.user.password || !this.user.username) {
      this.toastr.error('Email, password, and username are required', 'Registration Error');
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        this.toastr.success('Registration successful', 'Success');
        // Navigate to the login page after successful registration
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Registration error:', err);
      }
    });
  }
}
