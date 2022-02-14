import {
  CREATE_CUSTOMER,
  REMOVE_CUSTOMER,
} from './../schemas/customer/mutation.schema';
import { CUSTOMER, CUSTOMERS } from './../schemas/customer/query.schema';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from './../interfaces/customer.interface';
import { UPDATE_CUSTOMER } from '../schemas/customer/mutation.schema';

@Injectable()
export class CustomerService {
  constructor(private readonly apollo: Apollo) {}

  public customer(id: number): Observable<any> {
    return this.apollo.watchQuery({
      query: CUSTOMER,
      variables: { id },
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  public customers(): Observable<any> {
    return this.apollo.watchQuery({
      query: CUSTOMERS,
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  public createCustomer(
    createCustomerInput: CreateCustomerInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_CUSTOMER,
      variables: { createCustomerInput },
      refetchQueries: [
        {
          query: CUSTOMERS,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public updateCustomer(
    updateCustomerInput: UpdateCustomerInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_CUSTOMER,
      variables: { updateCustomerInput },
      refetchQueries: [
        {
          query: CUSTOMERS,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public removeCustomer(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: REMOVE_CUSTOMER,
      variables: { id },
      refetchQueries: [
        {
          query: CUSTOMERS,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }
}
