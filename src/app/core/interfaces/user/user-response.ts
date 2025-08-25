import { UserProfileResponse } from "./user-profile-response";

export interface UserResponse {
  id: string;       // UUID -> string
  email: string;
  status: string;
  role: string;
  profile: UserProfileResponse;
}