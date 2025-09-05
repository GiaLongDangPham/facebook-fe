import { UserResponse } from "../user/user-response";

export interface MessageResponse {
  id?: string;
  conversationId?: string;
  sender?: UserResponse;
  type?: string;
  content?: string;
  attachmentUrl?: string;
  parentMessageId?: string;
  createdAt?: Date;
}