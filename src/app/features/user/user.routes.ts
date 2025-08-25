import { Routes } from '@angular/router';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { PROFILE_ROUTES } from './profile/profile.routes';

export const USER_ROUTES: Routes = [
  {
    path: 'posts',
    component: PostComponent
  },
  {
    path: 'profile/:username',
    component: ProfileComponent,
  }
];
