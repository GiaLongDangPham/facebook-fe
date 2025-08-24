import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResetPasswordRequest } from '../../../core/interfaces/reset-password-request';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  user: ResetPasswordRequest = {
    token: '',
    newPassword: ''
  };

  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user.token = this.route.snapshot.queryParamMap.get('token') || '';
    console.log('Token:', this.user.token);
  }

  reset() {
    debugger
    if (this.user.newPassword !== this.confirmPassword) {
      this.toastr.error('Mật khẩu không khớp');
      return;
    }
    this.authService.resetPassword(this.user).subscribe({
      next: (res) => {
        this.toastr.success('Đặt lại mật khẩu thành công');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

}
