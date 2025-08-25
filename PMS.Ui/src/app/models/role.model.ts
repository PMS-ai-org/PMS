import { AuditableEntity } from "./auditable-entity.model";

export interface Role extends AuditableEntity {
  roleId: string;
  roleName: string;
}
export const Role = {
    Admin: 'Admin',
    Doctor: 'Doctor',
    Staff: 'Staff'
}