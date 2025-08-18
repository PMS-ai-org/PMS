import { CommonFields } from "./common.model";

export interface Site extends CommonFields {
  Id: string;
  ClinicId: string;
  Name: string;
  Neighborhood: string;
  Address: string;
  City: string;
  State: string;
  Lat: number;
  Lon: number;
}