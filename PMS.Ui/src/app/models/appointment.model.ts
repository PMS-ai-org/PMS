import { CommonFields } from "./common.model";

export interface Appointment extends CommonFields {
  Id: string;
  PatientId: string;
  DoctorId: string;
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
  MedicalHistory: string;
}