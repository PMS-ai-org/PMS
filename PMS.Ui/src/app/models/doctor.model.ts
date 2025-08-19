import { AuditableEntity } from "./auditable-entity.model";

export interface Doctor extends AuditableEntity {
  DoctorId: string;
  FirstName: string;
  LastName: string;
  Specialty: string;
  Phone: string;
  Email: string;
}