import {
  CREATE_ORDER,
  REMOVE_ORDER,
  UPDATE_ORDER,
} from './../schemas/order/mutation.schema';
import {
  CreateOrderInput,
  UpdateOrderInput,
} from './../interfaces/order.interface';
import { ORDERS } from './../schemas/order/query.schema';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable()
export class OrderService {
  order: any = null;

  constructor(private readonly apollo: Apollo) {}

  public getOrder(): any {
    return this.order;
  }

  public setOrder(order: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.order = order;
      resolve();
    });
  }

  // Query
  public orders(): Observable<any> {
    return this.apollo.watchQuery({
      query: ORDERS,
      errorPolicy: 'all',
    }).valueChanges;
  }

  // Mutation
  public createOrder(createOrderInput: CreateOrderInput): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_ORDER,
      variables: { createOrderInput },
      refetchQueries: [{ query: ORDERS, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public updateOrder(updateOrderInput: UpdateOrderInput): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_ORDER,
      variables: { updateOrderInput },
      refetchQueries: [],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public removeOrder(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: REMOVE_ORDER,
      variables: { id },
      refetchQueries: [{ query: ORDERS, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }
}
