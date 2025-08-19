export interface UserLogin {
  userId: string;
  username: string;
  email: string;
  passwordHash?: string;
  roleId: string;
  isFirstLogin?: boolean;
  isLocked?: boolean;
  failedAttempts?: number;
  lockoutEnd?: string;
  dateCreated?: string;
  dateModified?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  isActive?: boolean;
}
