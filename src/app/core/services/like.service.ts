import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private baseUrl = environment.apiUrl + environment.apiVersion + '/posts/likes';
  constructor(
    private http: HttpClient
  ) { }

  toggleLike(postId: string): Observable<{ isLiked: boolean}> {
    return this.http.post<{ isLiked: boolean}>(`${this.baseUrl}/${postId}`, {});
  }

  isLiked(postId: string): Observable<{ isLiked: boolean}> {
    return this.http.get<{ isLiked: boolean}>(`${this.baseUrl}/${postId}/is-liked`);
  }

  totalLikes(postId: string): Observable<{ totalLikes: number}> {
    return this.http.get<{ totalLikes: number}>(`${this.baseUrl}/${postId}/total-likes`);
  }
}
