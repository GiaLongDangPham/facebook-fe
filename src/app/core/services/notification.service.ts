import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { ActionEnum, NotificationResponse, StateEnum } from '../interfaces/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = environment.apiUrl + environment.apiVersion + '/notifications';
  private client: Client | null = null;
  public notifications$ = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient
  ) {}

  connect(recipientId: string) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // URL backend config
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      this.client?.subscribe(
        `/topic/notification/${recipientId}`, 
        (noti) => {
          const notification = JSON.parse(noti.body);
          this.notifications$.next([notification, ...this.notifications$.getValue()]);
        }
      );
    }

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;  // Quan trọng để lần sau connect lại
    }
  }

  subscribeNotifications() {
    return this.notifications$.asObservable();
  }

  getNotiWithin30days(recipientId: string): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(`${this.baseUrl}/${recipientId}`);
  }

  getUnseenCount(recipientId: string): Observable<{ countUnseen: number }> {
    return this.http.get<{ countUnseen: number }>(`${this.baseUrl}/${recipientId}/count-unseen`);
  }

  updateNotificationState(targetId: string, actionType: ActionEnum, state: StateEnum): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}?targetId=${targetId}&actionType=${actionType}&newState=${state}`,
    {});
  }

  markAllSeen(): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/mark-all-seen`, {});
  }
}
