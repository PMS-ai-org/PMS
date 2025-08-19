import { AuditableEntity } from "./auditable-entity.model";

export interface Appointment extends AuditableEntity {
  Id: string;
  PatientId: string;
  DoctorId: string;// not present in DB table
  BookedAt: string;
  ScheduledAt: string;
  ReminderSent: string;
  Status: string;
  LeadTimeHours: number;
  Dow: number;
  HourOfDay: number;
  SiteId: string;
  ClinicId: string;
  TreatmentPlan: string;
  MedicalHistory: string;// not present in DB table
}