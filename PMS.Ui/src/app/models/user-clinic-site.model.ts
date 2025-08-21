import { AuditableEntity } from "./auditable-entity.model";

export interface UserClinicSite extends AuditableEntity {
  userClinicSiteId: string;
  userId: string;
  clinicId: string;
  siteId: string;
}