import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileResponse } from '../interfaces/file/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = environment.apiUrl + environment.apiVersion + '/files';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<FileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileResponse>(this.baseUrl + "/upload", formData);
  }
}
