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
  clinicId: string;
}

export interface ClinicSite {
  clinicId: string;
  siteId: string;
}
