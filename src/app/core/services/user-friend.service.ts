import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Friend } from '../interfaces/user/user-friend';
import { PageResponse } from '../interfaces/page';

@Injectable({
  providedIn: 'root'
})
export class UserFriendService {

  private apiUrl = environment.apiUrl + environment.apiVersion + '/friends';
  constructor(
    private http: HttpClient
  ) { }

  sendRequest(addresseeId: string): Observable<Friend> {
    return this.http.post<Friend>(`${this.apiUrl}/request`, null, { params: { addresseeId } });
  }

  accept(requesterId: string): Observable<Friend> {
    return this.http.post<Friend>(`${this.apiUrl}/accept`, null, { params: { requesterId } });
  }

  cancelRequest(addresseeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cancel-request`, { params: { addresseeId } });
  }

  reject(requesterId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reject`, { params: { requesterId } });
  }

  unfriend(otherUserId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/unfriend`, { params: { otherUserId } });
  }

  getListFriends(username: string, page: number, size: number): Observable<PageResponse<Friend>> {
    return this.http.get<PageResponse<Friend>>(`${this.apiUrl}/${username}`, { params: { page, size } });
  }
}

