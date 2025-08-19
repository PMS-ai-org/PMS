import { AuditableEntity } from "./auditable-entity.model";

export interface MedicalHistory extends AuditableEntity {
  Id: string;
  PatientId: string;
  Code: string;
  Description: string;
  Source: string;
  RecordedAt: string; // ISO date string
  ClinicId?: string | null;
  SiteId?: string | null;
}