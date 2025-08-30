import { UserResponse } from "./user-response";

export interface Friend {
  otherUser?: UserResponse;
  status: 'accepted' | 'pending' | 'waiting' | 'none';
}
