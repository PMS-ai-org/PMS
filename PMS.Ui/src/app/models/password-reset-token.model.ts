export interface PasswordResetToken {
  id: string;
  token: string;
  expires: string;
  userId: string;
  isUsed: boolean;
  created: string;
}
