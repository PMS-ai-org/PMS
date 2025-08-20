import { AuditableEntity } from "./auditable-entity.model";

export interface Role extends AuditableEntity {
  RoleId: string;
  RoleName: string;
}
