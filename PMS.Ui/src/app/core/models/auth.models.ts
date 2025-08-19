export interface LoginRequest { username: string; password: string; }
export interface AuthResponse { accessToken: string; refreshToken?: string; expiresAt: string; role: string; userId: string; fullName: string; userAccessDetail: object }
export interface ForgotPasswordDto { email: string; }
export interface ResetPasswordDto { UserId: string; Token: string; NewPassword: string; }
