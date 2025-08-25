import { Component } from '@angular/core';
import { Post } from '../../../core/interfaces/post';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  posts: Post[] = [
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: 'https://i.pravatar.cc/100?img=1',
      content: 'Hôm nay trời đẹp quá 😍',
      image: 'https://picsum.photos/600/300?random=1',
      createdAt: '2 giờ trước'
    },
    {
      id: 2,
      author: 'Trần Thị B',
      avatar: 'https://i.pravatar.cc/100?img=2',
      content: 'Vừa đi Đà Lạt về, cảnh đẹp cực kỳ 🌲🌸',
      image: 'https://picsum.photos/600/300?random=2',
      createdAt: '5 giờ trước'
    },
    {
      id: 3,
      author: 'Bạn',
      avatar: 'https://i.pravatar.cc/100?img=3',
      content: 'Đây là post demo của chính mình ✨',
      createdAt: 'Hôm qua'
    }
  ];
}
