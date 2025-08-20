import { AuditableEntity } from "./auditable-entity.model";

export interface Clinic extends AuditableEntity {
  Id: string;
  Name: string;
  Speciality?: string;
}
