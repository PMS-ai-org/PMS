export interface UserAccess {
  userAccessId: string;
  userClinicSiteId: string;
  featureId: string;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}
