import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { UserResponse } from '../../core/interfaces/user/user-response';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { filter } from 'rxjs';
import { RightSidebarComponent } from "./right-sidebar/right-sidebar.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    SidebarComponent,
    TopNavbarComponent,
    RightSidebarComponent
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  currentUser: UserResponse | null = null;
  isInPostsPage = false;
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isInPostsPage = event.url.includes('/user/posts');
    });
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getUserResponseFromLocalStorage();
  }
}
