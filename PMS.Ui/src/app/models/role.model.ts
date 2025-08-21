import { AuditableEntity } from "./auditable-entity.model";

export interface Role extends AuditableEntity {
  RoleId: string;
  RoleName: string;
}
export const Role = {
    Admin: 'Admin',
    Doctor: 'Doctor',
    Staff: 'Staff'
}