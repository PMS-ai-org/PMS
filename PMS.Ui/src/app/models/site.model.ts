import { AuditableEntity } from "./auditable-entity.model";

export interface Site extends AuditableEntity {
  id: string;
  clinic_id: string;
  name: string;
  neighborhood?: string;
  address?: string;
  city?: string;
  state?: string;
  lat?: number;
  lon?: number;
}