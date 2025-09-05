import { Component, Input } from '@angular/core';
import { ConversationResponse } from '../../../../../core/interfaces/conversation/conversation';
import { UserResponse } from '../../../../../core/interfaces/user/user-response';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../profile/avatar/avatar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-message-info',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    RouterModule
  ],
  templateUrl: './message-info.component.html',
  styleUrl: './message-info.component.scss'
})
export class MessageInfoComponent {

  @Input() selectedConversation!: ConversationResponse | null;
  @Input() currentUser!: UserResponse | null;

  getOtherMember(conversation: ConversationResponse) {
    if (!conversation.members) return null;
    return conversation.members.find(m => m.user?.id !== this.currentUser?.id);
  }
}
