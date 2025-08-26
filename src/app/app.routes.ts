import { Routes } from '@angular/router';
import { UserComponent } from './features/user/user.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES),
      }
    ],
    canActivate: [authGuard]
  },
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
      }
    ]
    
  }
];
