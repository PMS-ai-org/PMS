import { AuditableEntity } from "./auditable-entity.model";

export interface Appointment extends AuditableEntity {
   id?: string;
  patientId: string;
  bookedAt: string;
  scheduledAt: string;
  reminderSent?: boolean;
  status?: string;
  leadTimeHours?: number;
  dow?: number;
  hourOfDay?: number;
  siteId?: string;
  clinicId?: string;
  treatmentPlan?: string;
}