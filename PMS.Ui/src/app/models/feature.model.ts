import { AuditableEntity } from "./auditable-entity.model";

export interface Feature extends AuditableEntity{
  FeatureId: string;
  FeatureName: string;
}
