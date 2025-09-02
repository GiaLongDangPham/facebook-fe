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
  private baseUrl = environment.apiUrl + environment.apiVersion + '/posts';
  constructor(private http: HttpClient) {}

  getCommentsByPost(postId: string, page: number, size: number): Observable<PageResponse<CommentResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<CommentResponse>>(`${this.baseUrl}/${postId}/comments`, { params });
  }

  countComments(postId: string): Observable<{ totalComments: number }> {
    return this.http.get<{ totalComments: number }>(`${this.baseUrl}/${postId}/comments/total-comments`);
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
    return this.http.post<CommentResponse>(`${this.baseUrl}/${postId}/comments`, null,
      { params }
    );
  }

  getReplies(commentId: string): Observable<PageResponse<CommentResponse>> {
    return this.http.get<PageResponse<CommentResponse>>(`${this.baseUrl}/comments/${commentId}/replies`);
  }

  getCommentById(id: string): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(`${this.baseUrl}/comments/${id}`);
  }
}
