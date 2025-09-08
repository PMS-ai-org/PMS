export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  fullName?: string;
  role?: string;
  // audit fields optionally
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
}

export interface Clinic {
  clinicId: string;
  clinicName: string;
}

export interface Site {
  siteId: string;
  siteName: string;
  userClinicSiteId: string;
  features: Features[];
}

export interface Features {
  featureId: string;
  featureName: string;
  routerLink:string;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  userAccessId: string;
}

export interface ClinicSite {
  clinicId: string;
  siteId: string;
}
