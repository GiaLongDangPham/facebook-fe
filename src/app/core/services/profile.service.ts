import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfileResponse } from '../interfaces/user-profile-response';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl + environment.apiVersion + '/user-profiles';
  constructor(
    private http: HttpClient
  ) { }

  getProfile(username: string): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/${username}`);
  }

  updateProfile(userId: string, data: UserProfileResponse): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(`${this.apiUrl}/${userId}`, data);
  }
}
