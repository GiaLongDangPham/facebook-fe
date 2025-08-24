import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RegisterRequest } from '../interfaces/register-request';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { Observable } from 'rxjs';
import { LogoutRequest } from '../interfaces/logout-request';
import { RefreshTokenRequest } from '../interfaces/refresh-token-request';
import { ForgotPasswordRequest } from '../interfaces/forgot-password-request';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + environment.apiVersion + '/auth';

  constructor(
    private http: HttpClient
  ) { }

  register(request: RegisterRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  logout(request: LogoutRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, request);
  }

  logoutAllDevices(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout-all-devices`, {});
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, request);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, request);
  }

  getMyInfo(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/me`);
  }

}
