import { AuditableEntity } from "./auditable-entity.model";

export interface PasswordResetToken extends AuditableEntity {
  Id: string;
  Token: string;
  Expires: string;
  UserId: string;
  IsUsed: boolean;
  Created: string;
}
