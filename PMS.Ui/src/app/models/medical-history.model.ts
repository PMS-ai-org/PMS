import { AuditableEntity } from "./common.model";

export interface MedicalHistory extends AuditableEntity {
  id: string;
  Id: string;
  PatientId: string;
  Details?: string;
  CreatedAt: string;
}