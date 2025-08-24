import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordRequest } from '../../../core/interfaces/forgot-password-request';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  user: ForgotPasswordRequest = {
    email: ''
  };

  constructor(
    private authService: AuthService
  ) { }

  search() {
    debugger
    this.authService.forgotPassword(this.user).subscribe({
      next: (res) => {
        debugger
        console.log('Success:', res);
      },
      error: (err) => {
        debugger
        console.error('Error:', err);
      }
    });
  }
}
