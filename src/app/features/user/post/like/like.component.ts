import { Component, Input } from '@angular/core';
import { PostResponse } from '../../../../core/interfaces/post/post';
import { is } from 'date-fns/locale';
import { LikeService } from '../../../../core/services/like.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-like',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './like.component.html',
  styleUrl: './like.component.scss'
})
export class LikeComponent {

  @Input() post: PostResponse | null = null;
  isLiked: boolean = false;
  totalLikes: number = 0;

  constructor(
    private likeService: LikeService
  ) { }

  ngOnInit() {
    this.getIsLiked();
    this.getTotalLikes();
  }

  toggleLike(){
    if(this.post?.id) {
      this.likeService.toggleLike(this.post.id).subscribe({
        next: (response) => {
          this.isLiked = !this.isLiked;
          this.totalLikes = this.isLiked ? this.totalLikes + 1 : this.totalLikes - 1;
        },
        error: (error) => {
          console.error('Error toggling like:', error);
        }
      });
    }
  }

  getIsLiked() {
    if(this.post?.id) {
      this.likeService.isLiked(this.post.id).subscribe(response => {
        this.isLiked = response.isLiked;
      });
    }
  }

  getTotalLikes() {
    if(this.post?.id) {
      this.likeService.totalLikes(this.post.id).subscribe(response => {
        this.totalLikes = response.totalLikes;
      });
    }
  }
}
