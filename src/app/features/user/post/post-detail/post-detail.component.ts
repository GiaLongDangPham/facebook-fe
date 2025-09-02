import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { PostResponse } from '../../../../core/interfaces/post/post';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../../profile/avatar/avatar.component';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { UserResponse } from '../../../../core/interfaces/user/user-response';
import { LikeComponent } from '../like/like.component';
import { CommentComponent } from '../comment/comment.component';
import { PostService } from '../../../../core/services/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AvatarComponent,
    TimeAgoPipe,
    LikeComponent,
    CommentComponent
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {

  @Input() post!: PostResponse;
  @Input() currentUserLoggedIn: UserResponse | null = null;
  @Input() isModal: boolean = false;
  @Input() highlightCommentId: string | null = null;
  @Output() updatedPost = new EventEmitter<PostResponse>();
  @Output() deletedPost = new EventEmitter<string>();
  privacyPostId: string | null = null;
  menuPostId: string | null = null;
  showCommentBox = false;
  totalComments?: number;

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit() {
    debugger
    this.totalComments = this.post.commentCount;
    this.showCommentBox = this.isModal;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['post'] && changes['post'].currentValue) {
      this.totalComments = this.post.commentCount;
      this.showCommentBox = this.isModal;
    }
  }

  updatePrivacyPost(id: string, privacy: string) {
    this.postService.updatePrivacyPost(id, privacy).subscribe({
      next: (res: PostResponse) => {
        this.updatedPost.emit(res);
      },
      error: (err) => {
        console.error('Error updating post privacy:', err);
      }
    });
  }

  togglePrivacyMenu(postId: string) {
    this.privacyPostId = this.privacyPostId === postId ? null : postId;
  }

  closePrivacyMenu() {
    this.privacyPostId = null;
  }

  isPrivacyMenuOpen(postId: string): boolean {
    return this.privacyPostId === postId;
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

  togglePostMenu(postId: string) {
    this.menuPostId = this.menuPostId === postId ? null : postId;
  }

  closePostMenu() {
    this.menuPostId = null;
  }

  isPostMenuOpen(postId: string): boolean {
    return this.menuPostId === postId;
  }

  deletePost(postId: string) {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.deletedPost.emit(postId);
      },
      error: err => console.error(err)
    });
  }

  toggleCommentBlock(post: PostResponse) {
    const newState = !post.commentLocked;
    this.postService.updateCommentBlockPost(post.id, newState).subscribe({
      next: (updatedPost: PostResponse) => {
        post.commentLocked = updatedPost.commentLocked;
      },
      error: err => console.error(err)
    });
  }

  
  toggleComment() {
    this.showCommentBox = !this.showCommentBox;
  }

}
