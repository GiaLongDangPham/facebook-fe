import { Routes } from '@angular/router';
import { PostComponent } from '../post/post.component';
import { ProfileAboutComponent } from './profile-about/profile-about.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  },
  {
    path: 'posts',
    component: PostComponent
  },
  {
    path: 'about',
    component: ProfileAboutComponent
  }
];
