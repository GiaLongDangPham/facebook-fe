import { PostMediaRequest } from "./post-media-request";

export interface PostRequest {
  content?: string;
  privacy?: string;
  commentLocked?: boolean;
  mediaList?: PostMediaRequest[];
}
