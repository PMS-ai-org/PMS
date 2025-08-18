import { CommonFields } from "./common.model";

export interface User extends CommonFields {
  Id: string;
  Email: string;
  PasswordHash: string;
  CreatedUtc: string;
}