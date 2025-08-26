import { UserResponse } from "../user/user-response";
import { PostMediaResponse } from "./post-media";

export interface PostResponse {
  id: string;
  author: UserResponse;
  content?: string;
  privacy?: string;
  commentLocked?: boolean;
  mediaList?: PostMediaResponse[];
  likeCount?: number;
  commentCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
