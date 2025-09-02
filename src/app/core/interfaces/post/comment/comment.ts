import { UserResponse } from "../../user/user-response";

export interface CommentResponse {
  id: string;
  postId: string;
  author: UserResponse;
  content: string;
  parentId: string;
  repliesCount: number;
  createdAt: Date;
  updatedAt: Date;
}