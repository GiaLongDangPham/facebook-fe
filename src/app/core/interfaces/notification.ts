import { UserResponse } from "./user/user-response";

export interface NotificationResponse {
  targetId: string;
  actor: UserResponse;
  actionPerformedId: string;
  actionType: ActionEnum;
  redirectURL: string;
  createdAt: Date;
  updatedAt: Date;
  state: StateEnum;
  recipientId: string;

  // // thêm thông tin enrich
  actorCount: number;    // số người đã like/comment
  previewText: string; // caption hoặc comment text
  imageURL: string;    // thumbnail post
}

export enum ActionEnum {
  LIKE_POST = 'LIKE_POST',
  COMMENT_POST = 'COMMENT_POST',
  COMMENT_REPLY = 'COMMENT_REPLY',
  ADD_FRIEND = 'ADD_FRIEND',
  ACCEPT_FRIEND = 'ACCEPT_FRIEND',
  COMMENT_TAG = 'COMMENT_TAG',
}

export enum StateEnum {
  UNSEEN = 'UNSEEN',
  SEEN = 'SEEN',
  SEEN_AND_READ = 'SEEN_AND_READ'
}