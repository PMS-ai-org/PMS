import { AuditableEntity } from "./auditable-entity.model";

export interface Patient extends AuditableEntity {
  id?: string;
  fullName: string;
  dob?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  age?: number;
  conditions?: string[];
  medications?: string[];
  notes?: string;
  createdAt?: string;
  homeClinicId?: string;
  homeSiteId?: string;
}