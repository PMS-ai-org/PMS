import { AuditableEntity } from "./auditable-entity.model";

export interface Site extends AuditableEntity {
  Id: string;
  ClinicId: string;
  Name: string;
  Neighborhood?: string;
  Address?: string;
  City?: string;
  State?: string;
  Lat?: number;
  Lon?: number;
}