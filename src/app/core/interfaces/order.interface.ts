import { Status } from '../enums/status';

export interface CreateOrderInput {
  employeeId: number;
  customerId: number;
  primaryOrderId?: number;
}

export interface UpdateOrderInput {
  id: number;
  status: Status;
  isOutProcess: boolean;
}

export interface FilterInput {
  typeName?: string;
  sortName?: string;
  specialName?: string;
  customerName?: string;
  haveProblems?: boolean;
  isProcess?: boolean;
  firstDate?: Date;
  lastDate?: Date;
  status?: string;
}