import { Status } from './../enums/status';
export interface CreateClotheInput {
  typeClotheId?: number;
  sortClotheId?: number;
  specialClothId?: number;
  orderId: number;
}

export interface UpdateClotheInput {
  ids: number[];
  orderId: number;
}

export interface CreateClotheProblemInput {
  status: Status;
  clotheIds: number[];
  problemClothes: number;
}
