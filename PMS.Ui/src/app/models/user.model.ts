import { AuditableEntity } from "./common.model";
import { Role } from "./role.model";

export interface User extends AuditableEntity {
  Id: string;
  Username: string;
  CreatedAt: string;
  UpdatedAt?: string;
  Roles?: Role[];
}