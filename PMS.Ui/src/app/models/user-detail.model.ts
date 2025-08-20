import { AuditableEntity } from "./auditable-entity.model";
import { Role } from "./role.model";

export interface UserDetail extends AuditableEntity {
  UserId: string;
  FullName: string;
  Address: string;
  Specialization: string;
  DateOfBirth: Date | null;
  PhoneNumber: number;
  Roles?: Role[];
}