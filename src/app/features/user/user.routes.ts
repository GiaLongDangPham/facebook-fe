import { Routes } from '@angular/router';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesComponent } from './messages/messages.component';
import { ManageFriendsComponent } from './manage-friends/manage-friends.component';
import { FriendRequestsComponent } from './manage-friends/friend-requests/friend-requests.component';
import { FriendSuggestsComponent } from './manage-friends/friend-suggests/friend-suggests.component';

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
  },
  {
    path: 'friends',
    component: ManageFriendsComponent,
    children: [
      {
        path: 'requests',
        component: FriendRequestsComponent
      },
      {
        path: 'suggests',
        component: FriendSuggestsComponent
      }
    ]
  }
];
