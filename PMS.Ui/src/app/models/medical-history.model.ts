export interface MedicalHistory {
  id: string;
  patient_id: string;
  code: string;
  description: string;
  source: string;
  recorded_at: string;
  clinic_id: string;
  site_id: string;
}