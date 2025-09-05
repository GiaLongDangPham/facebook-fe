import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarComponent } from '../../../profile/avatar/avatar.component';
import { ConversationResponse } from '../../../../../core/interfaces/conversation/conversation';
import { ConversationsService } from '../../../../../core/services/conversations.service';
import { UserResponse } from '../../../../../core/interfaces/user/user-response';
import { UserService } from '../../../../../core/services/user.service';
import { MessageResponse } from '../../../../../core/interfaces/conversation/messages';
import { MessageService } from '../../../../../core/services/message.service';
import { TimeAgoPipe } from '../../../../../core/pipes/time-ago.pipe';

@Component({
  selector: 'app-message-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    TimeAgoPipe
  ],
  templateUrl: './message-sidebar.component.html',
  styleUrl: './message-sidebar.component.scss'
})
export class MessageSidebarComponent {
  @Output() selectConversationEvent = new EventEmitter<ConversationResponse>();
  currentUser: UserResponse | null = null;
  conversations: ConversationResponse[] = [];
  selectedConversation: ConversationResponse | null = null;
  lastMessage: MessageResponse | null = null;

  constructor(
    private conversationsService: ConversationsService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.getUserResponseFromLocalStorage();
    this.loadConversations();
    this.messageService.onMessage().subscribe((msg) => {
      const idx = this.conversations.findIndex(c => c.id === msg.conversationId);
      if (idx !== -1) {
        // Cập nhật lastMessage
        this.conversations[idx].lastMessage = msg;
        // Đẩy lên đầu
        const conv = this.conversations.splice(idx, 1)[0];
        this.conversations.unshift(conv);
      }
    });
  }

  loadConversations() {
    if (!this.currentUser) return;
    this.conversationsService.getUserConversations(this.currentUser.id).subscribe({
      next: (data: ConversationResponse[]) => {
        this.conversations = data;
      },
      error: (err) => {
        console.error('Error fetching conversations:', err);
      }
    });
  }

  getOtherMember(conversation: ConversationResponse) {
    if (!conversation.members) return null;
    return conversation.members.find(m => m.user?.id !== this.currentUser?.id);
  }

  selectConversation(conversation: ConversationResponse) {
    this.selectedConversation = conversation;
    this.selectConversationEvent.emit(conversation);
  }
}
