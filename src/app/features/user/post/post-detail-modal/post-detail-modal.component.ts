import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { PostDetailComponent } from '../post-detail/post-detail.component';
import { PostResponse } from '../../../../core/interfaces/post/post';
import { UserResponse } from '../../../../core/interfaces/user/user-response';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-post-detail-modal',
  standalone: true,
  imports: [
    PostDetailComponent
  ],
  templateUrl: './post-detail-modal.component.html',
  styleUrl: './post-detail-modal.component.scss'
})
export class PostDetailModalComponent {

  postId!: string;
  post!: PostResponse;
  currentUser: UserResponse | null = null;
  highlightCommentId: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.getUserResponseFromLocalStorage();
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('id')!;
      this.postService.getPostById(this.postId).subscribe({
        next: (post) => {
          debugger
          this.post = post;

          // sau khi load post thì check query param highlightComment
          this.route.queryParamMap.subscribe(queryParams => {
            const highlightCommentId = queryParams.get('highlightComment');
            if (highlightCommentId) {
              this.highlightCommentId = highlightCommentId;
            }
          });
        },
        error: (error) => {
          console.error('Error fetching post details:', error);
        }
      });
    });
  }

  close() {
    this.router.navigate(['/user/posts']); // quay lại feed
  }

}
