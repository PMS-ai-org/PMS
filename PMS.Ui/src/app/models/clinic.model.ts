import { AuditableEntity } from "./common.model";

export interface Clinic extends AuditableEntity {
  Id: string;               // uuid
  Name: string;             // text
  Specialty: string;        // text
}
