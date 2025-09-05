import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MessageResponse } from '../interfaces/conversation/messages';
import { Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl + environment.apiVersion + '/messages';
  private stompClient: Client | null = null;
  private message$ = new Subject<MessageResponse>();

  constructor(  
    private http: HttpClient
  ) { }

  connect(userId: string) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket from MessageService');
      this.stompClient?.subscribe(
        `/topic/messagecontent/${userId}`, 
        (message) => {
          const msg = JSON.parse(message.body);
          this.message$.next(msg);
        }
      );
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  // lắng nghe từ component
  onMessage(): Observable<MessageResponse> {
    return this.message$.asObservable();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;  // Quan trọng để lần sau connect lại
    }
  }

  getMessagesByConversationId(conversationId: string): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.baseUrl}/conversation/${conversationId}`);
  }

  sendMessage(messageRequest: any): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}`, messageRequest);
  }

  getLastMessageByConversationId(conversationId: string): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(`${this.baseUrl}/conversation/${conversationId}/last-message`);
  }
}
