export interface InsuranceProvider { id: string; name: string; phone?: string; email?: string; }
export interface InsurancePlan { id: string; name: string; price?: number; }
export interface PatientInsurance { id: string; patientId: string; providerId: string; planId?: string; priority?: number; hasInsurance: boolean; policyNumber?: string; memberId?: string; isPrimary?: boolean; effectiveDate?: string; expirationDate?: string; cardImageUrl?: string; }

export interface PatientInsuranceDto {
  insuranceId?: string;
  patientId?: string;
  providerId?: string;
  planId?: string;
  policyNumber?: string;
  memberId?: string;
  isPrimary?: boolean;
  effectiveDate?: string;
  expirationDate?: string;
  priority?: number;
}
