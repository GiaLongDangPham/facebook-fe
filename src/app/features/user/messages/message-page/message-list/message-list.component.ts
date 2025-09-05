import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConversationResponse } from '../../../../../core/interfaces/conversation/conversation';
import { AvatarComponent } from '../../../profile/avatar/avatar.component';
import { UserResponse } from '../../../../../core/interfaces/user/user-response';
import { MessageResponse } from '../../../../../core/interfaces/conversation/messages';
import { MessageService } from '../../../../../core/services/message.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConversationsService } from '../../../../../core/services/conversations.service';
import { UserService } from '../../../../../core/services/user.service';
import { MessageInfoComponent } from '../message-info/message-info.component';

@Component({
  selector: 'app-message-detail',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    FormsModule,
    RouterModule,
    MessageInfoComponent
  ],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageDetailComponent {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  currentUser!: UserResponse | null;
  @Output() showInfoChange = new EventEmitter<boolean>();
  conversationId: string = '';
  selectedConversation!: ConversationResponse | null;
  showInfo: boolean = true;
  messages: MessageResponse[] = [];
  newMessage: string = '';

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private conversationsService: ConversationsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.getUserResponseFromLocalStorage();
    this.route.paramMap.subscribe(params => {
      this.conversationId = params.get('id')!;
      this.loadConversation();
    });
    // Lắng nghe tin nhắn realtime
    this.messageService.onMessage().subscribe((msg) => {
      if (msg.conversationId === this.conversationId && msg.sender?.id !== this.currentUser?.id) {
        this.messages.unshift(msg);
      }
    });
  }

  loadConversation() {
    if (!this.conversationId) return;
    debugger
    this.conversationsService.getConversationById(this.conversationId).subscribe({
      next: (data) => {
        this.selectedConversation = data;
        this.getMessagesByConversationId();
      },
      error: (err) => {
        console.error('Error fetching conversation:', err);
      }
    });
  }
  
  getMessagesByConversationId() {
    if (!this.selectedConversation?.id) return;
    debugger
    this.messageService.getMessagesByConversationId(this.selectedConversation.id).subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation?.id) return;
    const messageRequest = {
      conversationId: this.selectedConversation.id,
      senderId: this.currentUser?.id,
      type: 'TEXT',
      content: this.newMessage
    };
    this.messageService.sendMessage(messageRequest).subscribe({
      next: (data) => {
        this.messages.unshift(data);
        this.selectedConversation!.lastMessage = data;
        this.newMessage = '';
      },
      error: (err) => {
        console.error('Error sending message:', err);
      }
    });
  }

  getOtherMember(conversation: ConversationResponse) {
    if (!conversation.members) return null;
    return conversation.members.find(m => m.user?.id !== this.currentUser?.id);
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
    this.showInfoChange.emit(this.showInfo);
  }

}
