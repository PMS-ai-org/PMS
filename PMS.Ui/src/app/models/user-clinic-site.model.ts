import { AuditableEntity } from "./auditable-entity.model";

export interface UserDetail extends AuditableEntity {
  UserClinicSiteId: string;
  UserId: string;
  ClinicId: string;
  SiteId: string;
}