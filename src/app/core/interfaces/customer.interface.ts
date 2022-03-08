export interface CreateCustomerInput {
  idCard: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  subDistrict: string;
  email: string;
  proVince: string;
  disTrict: string;
  postalCode: number;
}

export interface UpdateCustomerInput {
  id: number;
  idCard?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  lineUserId?: string;
  subDistrict?: string;
  proVince?: string;
  disTrict?: string;
  postalCode?: number;
}
