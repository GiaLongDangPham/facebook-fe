import { UserResponse } from "../user/user-response";

export interface ConversationMemberResponse {
  user?: UserResponse;
  conversationId?: string;
  role?: string;
  lastReadMessageId?: string;
  joinedAt?: Date;
  mutedUntil?: Date;
}