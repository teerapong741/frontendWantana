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
