export interface CreateCustomerInput {
  idCard: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
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
  proVince?: string;
  disTrict?: string;
  postalCode?: number;
}
