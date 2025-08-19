export interface MedicalHistory extends AuditableEntity {
  id: string;
  patientId: string;
  code: string;
  description: string;
  source: string;
  createdAt: string; // or Date
  clinicId?: string;
  siteId?: string;
}
export interface AuditableEntity {
  created_at?: Date | null;
  created_by: string;
  updated_at: Date | null;
  updated_by: string;
}