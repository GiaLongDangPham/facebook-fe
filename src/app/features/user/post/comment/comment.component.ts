import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostResponse } from '../../../../core/interfaces/post/post';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserResponse } from '../../../../core/interfaces/user/user-response';
import { AvatarComponent } from '../../profile/avatar/avatar.component';
import { CommentService } from '../../../../core/services/comment.service';
import { CommentResponse } from '../../../../core/interfaces/post/comment/comment';
import { PageResponse } from '../../../../core/interfaces/page';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { CommentLikeService } from '../../../../core/services/comment-like.service';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    AvatarComponent,
    RouterModule,
    CommentDetailComponent
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() post: PostResponse | null = null;
  @Input() currentUser: UserResponse | null = null;
  @Input() commentLocked?: boolean;
  @Input() highlightCommentId: string | null = null;
  @Output() totalCommentsEvent = new EventEmitter<number>();
  @Output() addCommentEvent = new EventEmitter<boolean>();
  comments: CommentResponse[] = [];
  newComment: string = '';
  showReplies: boolean = false;

  constructor(
    private commentService: CommentService,
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    if(this.post?.id){
      this.commentService.getCommentsByPost(this.post.id, 0, 10).subscribe({
        next: (res: PageResponse<CommentResponse>) => {
          this.comments = res.content || [];
        },
        error: (err) => {
          console.error('Lỗi load comments', err);
        }
      });
    }
  }

  addComment() {
    if (!this.newComment.trim()) return;
    if(!this.post?.id) return;
    debugger
    this.commentService.addComment(this.post.id, this.newComment).subscribe({
      next: (comment) => {
        this.comments.unshift(comment); // thêm comment mới lên đầu
        this.newComment = '';
        this.addCommentEvent.emit(true);
      },
      error: (err) => {
        console.error('Lỗi khi thêm comment', err);
      }
    });
  }
}
