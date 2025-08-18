import { CommonFields } from "./common.model";

export interface MedicalHistory extends CommonFields {
  id: string;
  PatientId: string;
  Code: string;
  Description: string;
  Source: string;
  RecordedAt: string;
  ClinicId: string;
  SiteId: string;
}