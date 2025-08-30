import { Routes } from '@angular/router';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesComponent } from './messages/messages.component';

export const USER_ROUTES: Routes = [
  {
    path: 'posts',
    component: PostComponent
  },
  {
    path: 'profile/:username',
    component: ProfileComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent
  }
];
