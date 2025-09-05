import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from "@angular/router";
import { ConversationResponse } from '../../../../core/interfaces/conversation/conversation';
import { UserResponse } from '../../../../core/interfaces/user/user-response';
import { MessageSidebarComponent } from './message-sidebar/message-sidebar.component';
import { MessageService } from '../../../../core/services/message.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-message-page',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MessageSidebarComponent,
  ],
  templateUrl: './message-page.component.html',
  styleUrl: './message-page.component.scss'
})
export class MessagePageComponent {
  currentUser: UserResponse | null = null;
  showInfo: boolean = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.getUserResponseFromLocalStorage();
    if (this.currentUser) {
      this.messageService.connect(this.currentUser.id); // connect 1 lần
    }
}

  selectConversation(conversation: ConversationResponse) {
    this.router.navigate(['/user/messages', conversation.id]);
  }

}
