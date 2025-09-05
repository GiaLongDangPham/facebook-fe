import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConversationResponse } from '../interfaces/conversation/conversation';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  private baseUrl = environment.apiUrl + environment.apiVersion + '/conversations';
  constructor(
    private http: HttpClient
  ) { }

  getUserConversations(userId: string): Observable<ConversationResponse[]> {
    return this.http.get<ConversationResponse[]>(`${this.baseUrl}`, { params: { userId } });
  }

  getConversationById(conversationId: string): Observable<ConversationResponse> {
    return this.http.get<ConversationResponse>(`${this.baseUrl}/${conversationId}`);
  }
}
 