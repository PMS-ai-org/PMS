import { AuditableEntity } from "./auditable-entity.model";

export interface Clinic extends AuditableEntity {
  Id: string;
  Name: string;
  Neighborhood?: string;
  Address?: string;
  City?: string;
  State?: string;
  Lat?: number;
  Lon?: number;
  CreatedAt: string;
}
