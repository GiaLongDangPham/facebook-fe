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
import { PostDetailComponent } from './post-detail/post-detail.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent,
    RouterModule,
    PostDetailComponent,
    InfiniteScrollDirective
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

  // Infinite Scroll
  page = 0;
  size = 2;
  totalPages = 0;
  isLoading = false;

  constructor(
    private fileService: FileService,
    private postService: PostService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    if (!this.currentUserLoggedIn) {
      this.currentUserLoggedIn = this.userService.getUserResponseFromLocalStorage();
    }
    this.resetAndLoad();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentUsername'] && !changes['currentUsername'].firstChange) {
      this.resetAndLoad(); // reload posts khi username thay đổi
    }
  }

  resetAndLoad() {
    this.page = 0;
    this.posts = [];
    this.loadPosts();
  }

  
  loadMore() {
    debugger
    console.log('Scrolled!! page:', this.page, 'total:', this.totalPages);
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadPosts();
    }
  }

  loadPosts() {
    if (this.isLoading) return;
    this.isLoading = true;

    const request$ = this.currentUsername
      ? this.postService.getPostsByUser(this.currentUsername, this.page, this.size)
      : this.postService.getAllPosts(this.page, this.size);
    debugger
    request$.subscribe({
      next: (res: PageResponse<PostResponse>) => {
        this.posts = [...this.posts, ...(res.content || [])];
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.isLoading = false;
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

  updatePrivacyPost(post: PostResponse) {
    const index = this.posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      this.posts[index] = post;
    }
  }

  deletePost(postId: string) {
    const index = this.posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      this.posts.splice(index, 1);
    }
  }

}
