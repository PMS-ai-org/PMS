import { AuditableEntity } from "./auditable-entity.model";

export interface Appointment extends AuditableEntity {
  id?: string;
  patient_id?: string;
  patientId?: string;
  patientName?: string;
  booked_at?: string;
  bookedAt?: string;
  scheduled_at?: string;
  scheduledAt?: string;
  reminder_sent?: boolean;
  status?: string;
  lead_time_hours?: number;
  dow?: number;
  hour_of_day?: number;
  site_id?: string;
  clinic_id?: string;
  treatment_plan?: string;
  notes?: string;
}