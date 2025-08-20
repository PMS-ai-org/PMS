import { AuditableEntity } from "./auditable-entity.model";

export interface UserClinicSite extends AuditableEntity {
  UserClinicSiteId: string;
  UserId: string;
  ClinicId: string;
  SiteId: string;
}