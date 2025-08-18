import { CommonFields } from "./common.model";

export interface Patient extends CommonFields {
  PatientId: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  Phone: string;
  Email: string;
}