import { Component, Input } from '@angular/core';
import { CommentResponse } from '../../../../../core/interfaces/post/comment/comment';
import { CommentLikeService } from '../../../../../core/services/comment-like.service';
import { TimeAgoPipe } from '../../../../../core/pipes/time-ago.pipe';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../profile/avatar/avatar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../../../core/services/comment.service';
import { UserResponse } from '../../../../../core/interfaces/user/user-response';
import { MentionHighlightPipe } from '../../../../../core/pipes/mention-highlight.pipe';

@Component({
  selector: 'app-comment-detail',
  standalone: true,
  imports: [
    TimeAgoPipe,
    CommonModule,
    AvatarComponent,
    RouterModule,
    FormsModule,
    MentionHighlightPipe,
  ],
  templateUrl: './comment-detail.component.html',
  styleUrl: './comment-detail.component.scss'
})
export class CommentDetailComponent {
  @Input() comment!: CommentResponse;
  @Input() currentUser: UserResponse | null = null;
  isLiked: boolean = false;
  totalLikes: number = 0;
  showReplyBox = false;
  replyContent = '';
  replies: CommentResponse[] = [];
  repliesLoaded = false;
  mentionedUserIds: string[] = [];

  constructor(
    private commentLikeService: CommentLikeService,
    private commentService: CommentService,
  ) {}

  ngOnInit() {
    this.getIsLiked();
    this.getTotalLikes();
  }

  toggleLike(){
    this.commentLikeService.toggleLike(this.comment.id).subscribe(response => {
      this.isLiked = response.isLiked;
      this.totalLikes = this.isLiked ? this.totalLikes + 1 : this.totalLikes - 1;
    });
  }

  getIsLiked() {
    if(this.comment?.id) {
      this.commentLikeService.isLiked(this.comment.id).subscribe(response => {
        this.isLiked = response.isLiked;
      });
    }
  }

  getTotalLikes() {
    if(this.comment?.id) {
      this.commentLikeService.totalLikes(this.comment.id).subscribe(response => {
        this.totalLikes = response.totalLikes;
      });
    }
  }

  toggleReplyBox() {
    debugger
    this.showReplyBox = !this.showReplyBox;
    if (this.showReplyBox) {
      this.replyContent = `@${this.comment.author.profile.username} `;
      // gán userId người được mention
      this.mentionedUserIds = [this.comment.author.id];
    } else {
      this.replyContent = '';
      this.mentionedUserIds = [];
    }
  }

  submitReply() {
    if (!this.replyContent.trim()) return;
    debugger
    this.commentService.addComment(this.comment.postId, this.replyContent, this.comment.id, this.mentionedUserIds).subscribe({
      next: (newReply: CommentResponse) => {
        if (this.repliesLoaded) {
          this.replies.unshift(newReply);
        }
        // Luôn tăng repliesCount để nút "Xem phản hồi" cập nhật
        this.comment.repliesCount++;
      }, 
      error: (err) => {
        console.error('Error adding reply:', err);
      },
      complete: () => {
        this.replyContent = '';
        this.showReplyBox = false;
        this.mentionedUserIds = [];
      }
    });
  }

  loadReplies() {
    if (this.repliesLoaded) {
      // nếu đã load rồi thì toggle hiển thị thôi
      this.repliesLoaded = false;
      this.replies = [];
      return;
    }

    this.commentService.getReplies(this.comment.id).subscribe({
      next: (response) => {
        if (response.content) this.replies = response.content;
        this.repliesLoaded = true;
      },
      error: (error) => {
        console.error('Error loading replies:', error);
      }
    });
  }
}
