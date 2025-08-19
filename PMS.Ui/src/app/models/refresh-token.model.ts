export interface RefreshToken {
  id: string;
  token: string;
  expires: string;
  isRevoked: boolean;
  userId: string;
  created: string;
  createdByIp?: string;
  revoked?: string;
  revokedByIp?: string;
  replacedByToken?: string;
}
