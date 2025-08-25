import { AuditableEntity } from "./auditable-entity.model";

export interface Appointment extends AuditableEntity {
  id?: string;
  patient_id?: string;
  booked_at?: string;
  scheduled_at?: string;
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