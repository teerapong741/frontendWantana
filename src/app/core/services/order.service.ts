import {
  CREATE_ORDER,
  REMOVE_ORDER,
  UPDATE_ORDER,
} from './../schemas/order/mutation.schema';
import {
  CreateOrderInput,
  FilterInput,
  UpdateOrderInput,
} from './../interfaces/order.interface';
import {
  ORDER,
  ORDERS,
  FIND_ONE_BY_PRIMARY_ID,
  PRIMARY_ORDERS,
  FILTER_ORDER,
} from './../schemas/order/query.schema';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable()
export class OrderService {
  private $order: any = null;

  constructor(private readonly apollo: Apollo) {}

  public getOrder(): any {
    return this.$order;
  }

  public setOrder(order: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$order = order;
      resolve();
    });
  }

  // Query
  public order(id: number): Observable<any> {
    return this.apollo.watchQuery({
      query: ORDER,
      variables: { id },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }).valueChanges;
  }

  public orders(): Observable<any> {
    return this.apollo.watchQuery({
      query: ORDERS,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }).valueChanges;
  }

  public filterOrder(filterInput: FilterInput): Observable<any> {
    return this.apollo.watchQuery({
      query: FILTER_ORDER,
      variables: { filterInput },
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  public primaryOrders(): Observable<any> {
    return this.apollo.watchQuery({
      query: PRIMARY_ORDERS,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }).valueChanges;
  }

  public findOneByPrimaryId(id: number): Observable<any> {
    return this.apollo.watchQuery({
      query: FIND_ONE_BY_PRIMARY_ID,
      variables: { id },
      errorPolicy: 'all',
    }).valueChanges;
  }

  // Mutation
  public createOrder(createOrderInput: CreateOrderInput): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_ORDER,
      variables: { createOrderInput },
      refetchQueries: [
        { query: ORDERS, fetchPolicy: 'network-only', errorPolicy: 'all' },
        {
          query: PRIMARY_ORDERS,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public updateOrder(updateOrderInput: UpdateOrderInput): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_ORDER,
      variables: { updateOrderInput },
      refetchQueries: [
        { query: ORDERS, fetchPolicy: 'network-only', errorPolicy: 'all' },
        {
          query: PRIMARY_ORDERS,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public removeOrder(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: REMOVE_ORDER,
      variables: { id },
      refetchQueries: [
        { query: ORDERS, fetchPolicy: 'network-only', errorPolicy: 'all' },
        {
          query: PRIMARY_ORDERS,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }
}
