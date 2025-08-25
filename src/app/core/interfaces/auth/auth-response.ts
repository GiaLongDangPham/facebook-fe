import { UserResponse } from "../user/user-response";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userResponse: UserResponse;
}