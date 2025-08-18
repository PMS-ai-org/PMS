import { AuditableEntity } from "./common.model";

export interface User extends AuditableEntity {
  Id: string;
  Email: string;
  PasswordHash: string;
  CreatedUtc: string;
}