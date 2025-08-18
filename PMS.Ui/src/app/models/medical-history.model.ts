import { AuditableEntity } from "./common.model";

export interface MedicalHistory extends AuditableEntity {
  id: string;
  PatientId: string;
  Code: string;
  Description: string;
  Source: string;
  RecordedAt: string;
  ClinicId: string;
  SiteId: string;
}