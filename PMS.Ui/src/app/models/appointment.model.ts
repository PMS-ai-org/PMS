export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  booked_at: string;
  scheduled_at: string;
  reminder_sent: string;
  status: string;
  lead_time_hours: number;
  dow: number;
  hour_of_day: number;
  created_at: string;
  site_id: string;
  clinic_id: string;
  treatment_plan: string;
  medical_history: string;
}
