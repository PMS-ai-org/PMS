import { AuditableEntity } from "./auditable-entity.model";

export interface MedicalHistory extends AuditableEntity {
  id?: string;
  patientId: string;
  code: string;
  description: string;
  source?: string;
  clinicId?: string | null;
  siteId?: string | null;
}