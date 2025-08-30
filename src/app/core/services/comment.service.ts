import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentResponse } from '../interfaces/post/comment/comment';
import { PageResponse } from '../interfaces/page';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = environment.apiUrl + environment.apiVersion + '/posts/comments';
  constructor(private http: HttpClient) {}

  getCommentsByPost(postId: string): Observable<PageResponse<CommentResponse>> {
    return this.http.get<PageResponse<CommentResponse>>(`${this.baseUrl}/${postId}`);
  }

  countComments(postId: string): Observable<{ totalComments: number }> {
    return this.http.get<{ totalComments: number }>(`${this.baseUrl}/${postId}/total-comments`);
  }
 
  addComment(postId: string, content: string, parentId?: string, mentionedUserIds?: string[]): Observable<CommentResponse> {
    let params = new HttpParams().set("content", content);

    if (parentId) {
      params = params.set("parentId", parentId);
    }
    if (mentionedUserIds && mentionedUserIds.length > 0) {
      mentionedUserIds.forEach(id => {
        params = params.append("mentionedUserIds", id);
      });
    }
    return this.http.post<CommentResponse>(`${this.baseUrl}/${postId}`, null,
      { params }  
    );
  }

  getReplies(commentId: string): Observable<PageResponse<CommentResponse>> {
    return this.http.get<PageResponse<CommentResponse>>(`${this.baseUrl}/${commentId}/replies`);
  }
}
