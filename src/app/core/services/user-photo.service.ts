import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../interfaces/user/photo';

@Injectable({
  providedIn: 'root'
})
export class UserPhotoService {

  private apiUrl = environment.apiUrl + environment.apiVersion + '/photos';
  constructor(
    private http: HttpClient
  ) { }


  getUserPhotos(userId: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/${userId}`);
  }

  deletePhoto(photoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${photoId}`);
  }
}
