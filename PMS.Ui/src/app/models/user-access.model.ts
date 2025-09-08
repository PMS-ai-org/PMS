import { AuditableEntity } from "./auditable-entity.model";

export interface UserAccess extends AuditableEntity{
  UserAccessId: string;
  UserClinicSiteId: string;
  FeatureId: string;
  CanAdd: boolean;
  CanEdit: boolean;
  CanDelete: boolean;
  CanView: boolean;
}
