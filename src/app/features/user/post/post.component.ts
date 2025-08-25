import { Component, Input } from '@angular/core';
import { PostResponse } from '../../../core/interfaces/post/post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserResponse } from '../../../core/interfaces/user/user-response';
import { FileService } from '../../../core/services/file.service';
import { PostService } from '../../../core/services/post.service';
import { FileResponse } from '../../../core/interfaces/file/file';
import { PostRequest } from '../../../core/interfaces/post/post-request';
import { PostMediaRequest } from '../../../core/interfaces/post/post-media-request';
import { PageResponse } from '../../../core/interfaces/page';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() currentUser: UserResponse | null = null;
  posts: PostResponse[] = [];

  selectedFiles: File[] = [];   // file user chọn nhưng chưa upload
  previewUrls: string[] = [];   // hiển thị preview cho user

  content: string = '';

  isPosting: boolean = false;

  constructor(
    private fileService: FileService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    if (!this.currentUser) return;
    this.postService.getPostsByUser(this.currentUser?.id, 0, 10).subscribe({
      next: (res: PageResponse<PostResponse>) => {
        debugger
        this.posts = res.content || [];
      },
      error: (err) => {
        debugger
        console.error('Error loading posts:', err);
      }
    });
  }

  // chọn file
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        this.selectedFiles.push(file);
        this.previewUrls.push(URL.createObjectURL(file)); // preview
      });
    }
  }

  // bỏ file đã chọn
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  // đăng bài
  createPost() {
    this.isPosting = true;
    if (!this.content.trim() && this.selectedFiles.length === 0) {
      return; // không có nội dung và file thì không cho đăng
    }
    debugger

    if (this.selectedFiles.length > 0) {
      // Tạo mảng các Observable upload file
      const uploadObservables = this.selectedFiles.map(file => this.fileService.uploadFile(file));

      forkJoin(uploadObservables).subscribe({
        next: (responses: FileResponse[]) => {
          const postMediaRequestList: PostMediaRequest[] = responses.map(
            (file: FileResponse, index: number) => ({
              url: file.url,
              mediaType: file.type,
              position: index
            })
          );

          const postRequest: PostRequest = {
            content: this.content,
            privacy: 'PUBLIC',
            commentLocked: false,
            mediaList: postMediaRequestList
          };

          this.postService.createPost(postRequest).subscribe({
            next: (res: PostResponse) => {
              this.posts.unshift(res);
              this.resetForm();
            },
            error: (err) => {
              console.error('Error creating post:', err);
              alert('Đăng bài thất bại');
            }
          });
        },
        error: (err) => {
          console.error('Error uploading files:', err);
          alert('Upload file thất bại');
        }
      });
    } else {
      // Nếu chỉ có nội dung, không có file
      const postRequest: PostRequest = {
        content: this.content,
        privacy: 'PUBLIC',
        commentLocked: false,
        mediaList: []
      };

      this.postService.createPost(postRequest).subscribe({
        next: (res: PostResponse) => {
          this.posts.unshift(res);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating post:', err);
          alert('Đăng bài thất bại');
        }
      });
    }

  }

  resetForm() {
    this.content = '';
    this.selectedFiles = [];
    this.previewUrls = [];
  }
}
