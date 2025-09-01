import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PostRequest } from '../interfaces/post/post-request';
import { PostResponse } from '../interfaces/post/post';
import { Observable } from 'rxjs';
import { PageResponse } from '../interfaces/page';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl = environment.apiUrl + environment.apiVersion + '/posts';

  constructor(private http: HttpClient) {}

  createPost(post: PostRequest) {
    return this.http.post<PostResponse>(this.baseUrl, post);
  }

  getPostsByUser(currentUsername: string, page: number, size: number): Observable<PageResponse<PostResponse>> {
    return this.http.get<PageResponse<PostResponse>>(`${this.baseUrl}/user/${currentUsername}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  getPostById(id: string): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.baseUrl}/${id}`);
  }

  getAllPosts(page: number, size: number): Observable<PageResponse<PostResponse>> {
    return this.http.get<PageResponse<PostResponse>>(`${this.baseUrl}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  updatePrivacyPost(id: string, privacy: string): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.baseUrl}/privacy/${id}`, { privacy });
  }

  updateCommentBlockPost(id: string, commentLocked: boolean): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.baseUrl}/comment/${id}`, { commentLocked });
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
