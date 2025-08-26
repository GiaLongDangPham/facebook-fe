import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = 'access_token';
  private apiUrl = environment.apiUrl + environment.apiVersion + '/tokens';
  constructor(
    private http: HttpClient
  ) { }


  //getter/setter
  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY) ?? '';
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getRefreshToken(accessToken: string): Observable<{ refreshToken: string }> {
    return this.http.get<{ refreshToken: string }>(`${this.apiUrl}/refresh-token/${accessToken}`);
  }
}
