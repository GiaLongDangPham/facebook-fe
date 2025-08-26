import { Component, Input, SimpleChanges } from '@angular/core';
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
import { AvatarComponent } from '../profile/avatar/avatar.component';
import { UserService } from '../../../core/services/user.service';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../../../core/pipes/time-ago.pipe';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent,
    RouterModule,
    TimeAgoPipe
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() currentUserLoggedIn: UserResponse | null = null;
  @Input() currentUsername: string | null = null;
  posts: PostResponse[] = [];
  selectedFiles: File[] = [];   // file user chọn nhưng chưa upload
  previewUrls: string[] = [];   // hiển thị preview cho user
  content: string = '';
  isPosting: boolean = false;
  privacyMenuPostId: string | null = null;

  constructor(
    private fileService: FileService,
    private postService: PostService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadPosts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentUsername'] && !changes['currentUsername'].firstChange) {
      this.loadPosts(); // reload posts khi username thay đổi
    }
  }

  loadPosts() {
    if (!this.currentUsername) {
      this.currentUserLoggedIn = this.userService.getUserResponseFromLocalStorage();
      this.postService.getAllPosts(0, 10).subscribe({
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
    else {
      this.postService.getPostsByUser(this.currentUsername, 0, 10).subscribe({
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

  updatePrivacyPost(id: string, privacy: string) {
    this.postService.updatePrivacyPost(id, privacy).subscribe({
      next: (res: PostResponse) => {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
          this.posts[index] = res;
        }
      },
      error: (err) => {
        console.error('Error updating post privacy:', err);
      }
    });
  }

  togglePrivacyMenu(postId: string) {
    this.privacyMenuPostId = this.privacyMenuPostId === postId ? null : postId;
  }

  isPrivacyMenuOpen(postId: string): boolean {
    return this.privacyMenuPostId === postId;
  }

  getPrivacyLabel(privacy: string | undefined): string {
    switch (privacy) {
      case 'PUBLIC': return 'Công khai';
      case 'FRIENDS': return 'Bạn bè';
      case 'ONLY_ME': return 'Chỉ mình tôi';
      case 'CUSTOM': return 'Tuỳ chỉnh';
      default: return '';
    }
  }

  getPrivacyIcon(privacy: string | undefined): string {
    switch (privacy?.toUpperCase()) {
      case 'PUBLIC': return 'fa-globe';
      case 'FRIENDS': return 'fa-user-friends';
      case 'ONLY_ME': return 'fa-lock';
      case 'CUSTOM': return 'fa-cog';
      default: return '';
    }
  }
}
