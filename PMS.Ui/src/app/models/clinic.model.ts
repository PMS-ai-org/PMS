import { AuditableEntity } from "./auditable-entity.model";

export interface Clinic extends AuditableEntity {
  id: string;
  name: string;
  speciality?: string;
}
