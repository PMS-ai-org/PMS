import { CommonFields } from "./common.model";

export interface Clinic extends CommonFields {
  Id: string;               // uuid
  Name: string;             // text
  Specialty: string;        // text
}
