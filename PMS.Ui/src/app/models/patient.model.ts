import { AuditableEntity } from "./auditable-entity.model";

export interface Patient extends AuditableEntity {
  PatientId: string;
  FullName: string;
  Dob: Date | null;
  Gender: string;
  FirstName: string;// not present in DB table
  LastName: string;// not present in DB table
  DateOfBirth: string;// not present in DB table
  Phone: string;
  Email: string;
  Id: string;
  Name: string;
  Address: string;
  Age: number;
  Conditions: string[];
  MedicalHistory: string[];// not present in DB table
  Medications: string[];
  Notes: string;
  HomeClinicId: string;
  HomeSiteId: string;
}