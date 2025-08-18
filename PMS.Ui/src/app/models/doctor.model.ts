import { CommonFields } from "./common.model";

export interface Doctor extends CommonFields {
  DoctorId: string;
  FirstName: string;
  LastName: string;
  Specialty: string;
  Phone: string;
  Email: string;
}