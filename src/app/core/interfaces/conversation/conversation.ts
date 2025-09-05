import { ConversationMemberResponse } from "./conversation-member";
import { MessageResponse } from "./messages";

export interface ConversationResponse {
  id?: string;
  type?: string;
  title?: string;
  lastMessage?: MessageResponse;
  members?: ConversationMemberResponse[];
}