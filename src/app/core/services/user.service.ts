import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserResponse } from '../interfaces/user/user-response';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + environment.apiVersion + '/users';
  private stompClient: Client | null = null;

  // BehaviorSubject giữ danh sách online
  private activeUsers$ = new BehaviorSubject<UserResponse[]>([]);

  constructor(
    private http: HttpClient
  ) { }

  connect(user: UserResponse) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket from UserService');
      this.subscribeActive();
      this.sendActiveUser(user);
    };

    this.stompClient.activate();
  }

  private subscribeActive() {
    this.stompClient?.subscribe(`/topic/active`, (message) => {
      const users: UserResponse[] = JSON.parse(message.body);
      this.activeUsers$.next(users); // cập nhật danh sách mới
    });
  }

  private sendActiveUser(user: UserResponse) {
    this.stompClient?.publish({
      destination: '/app/user/connect',
      body: JSON.stringify(user)
    });
  }

  // gọi khi user logout hoặc đóng tab
  disconnect(user: UserResponse) {
    this.stompClient?.publish({
      destination: '/app/user/disconnect',
      body: JSON.stringify(user)
    });
    this.stompClient?.deactivate();
  }

  // subscribe trong component
  getActiveUsers(): Observable<UserResponse[]> {
    return this.activeUsers$.asObservable();
  }

  // fallback: lấy danh sách online hiện tại từ REST
  // fetchOnlineUsers(): Observable<UserResponse[]> {
  //   return this.http.get<UserResponse[]>(`${this.apiUrl}/online`);
  // }

  getUserByUsername(username: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${username}`);
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse | null) {
    try {
      if (userResponse == null || !userResponse) {
        return;
      }

      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);
      // Save the JSON string to local storage with a key (e.g., "userResponse")
      localStorage.setItem('user', userResponseJSON);
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }
  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      // Retrieve the JSON string from local storage using the key
      const userResponseJSON = localStorage.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      // Parse the JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON!);

      return userResponse;
    } catch (error) {
      console.error(
        'Error retrieving user response from local storage:',
        error
      );
      return null; // Return null or handle the error as needed
    }
  }
  removeUserFromLocalStorage(): void {
    try {
      // Remove the user data from local storage using the key
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
      // Handle the error as needed
    }
  }
}
