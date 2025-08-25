export interface UserProfileResponse {
  userId?: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  gender?: string;
  dob?: string;      // LocalDate -> string ISO
  location?: string;
  website?: string;
}