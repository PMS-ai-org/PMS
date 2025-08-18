import { AuditableEntity } from "./common.model";

export interface Patient extends AuditableEntity {
  PatientId: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  Phone: string;
  Email: string;
  Id: string;
  Name: string;
  CreatedAt: string;
}