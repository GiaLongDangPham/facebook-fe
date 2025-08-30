import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentLikeService {
  private baseUrl = environment.apiUrl + environment.apiVersion + '/comments/likes';
  constructor(
    private http: HttpClient
  ) { }

  toggleLike(commentId: string): Observable<{ isLiked: boolean}> {
    return this.http.post<{ isLiked: boolean}>(`${this.baseUrl}/${commentId}`, {});
  }

  isLiked(commentId: string): Observable<{ isLiked: boolean}> {
    return this.http.get<{ isLiked: boolean}>(`${this.baseUrl}/${commentId}/is-liked`);
  }

  totalLikes(commentId: string): Observable<{ totalLikes: number}> {
    return this.http.get<{ totalLikes: number}>(`${this.baseUrl}/${commentId}/total-likes`);
  }
}
