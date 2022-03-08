import { Role } from '../enums/role';

export interface createEmployeeInput {
  idCard: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: Role;
  subDistrict: string;
  proVince: string;
  disTrict: string;
  postalCode: number;
}

export interface updateEmployeeInput {
  id: string;
  idCard?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  role?: Role;
  subDistrict?: string;
  proVince?: string;
  disTrict?: string;
  postalCode?: number;
}
