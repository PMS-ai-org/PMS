import { AuditableEntity } from "./auditable-entity.model";

export interface RefreshToken extends AuditableEntity {
  Id: string;
  Token: string;
  Expires: string;
  IsRevoked: boolean;
  UserId: string;
  Created: string;
  CreatedByIp?: string;
  Revoked?: string;
  RevokedByIp?: string;
  ReplacedByToken?: string;
}
