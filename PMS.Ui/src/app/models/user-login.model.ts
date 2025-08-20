import { AuditableEntity } from "./auditable-entity.model";

export interface UserLogin extends AuditableEntity{
  UserId: string;
  Username: string;
  Email: string;
  PasswordHash?: string;
  RoleId: string;
  IsFirstLogin?: boolean;
  IsLocked?: boolean;
  FailedAttempts?: number;
  LockoutEnd?: string;
  DateCreated?: string;
  DateModified?: string;
  IsActive?: boolean;
}
