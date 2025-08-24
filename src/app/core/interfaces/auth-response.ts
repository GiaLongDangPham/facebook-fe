import { UserResponse } from "./user-response";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userResponse: UserResponse;
}