import { AuditableEntity } from "./auditable-entity.model";
import { PatientInsuranceDto } from "./insurance";

export interface Patient extends AuditableEntity {
  id?: string;
  full_name: string;            // text
  dob?: string | undefined;          // date
  gender?: string | null;       // text
  phone?: string | null;        // text
  email?: string | null;        // text
  address?: string | null;      // text
  age?: number | null;          // integer
  conditions?: string[] | null; // text[]
  medications?: string[] | null;// text[]
  notes?: string | null;        // text
  createdAt?: string;
  homeClinicId?: string;
  homeSiteId?: string;
  hasInsurance?: boolean;      // backend flag to decide add vs update insurance
  insuranceId?: string | null; // FK to PatientInsurance
  insurance?: PatientInsuranceDto;
}