import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
import { UserResponse } from '../../../core/interfaces/user/user-response';

@Component({
  selector: 'app-popup-chat',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent
  ],
  templateUrl: './popup-chat.component.html',
  styleUrl: './popup-chat.component.scss'
})
export class PopupChatComponent {

  @Input() popup!: UserResponse;
  @Input() isOnline: boolean = false;
  @Output() closeChat = new EventEmitter<any>();

  onClose(chat: any) {
    this.closeChat.emit(chat);
  }
}
