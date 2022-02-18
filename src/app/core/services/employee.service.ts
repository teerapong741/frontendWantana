import {
  createEmployeeInput,
  updateEmployeeInput,
} from './../interfaces/employee.interface';
import {
  CREATE_EMPLOYEE,
  REMOVE_EMPLOYEE,
  RESTORE_EMPLOYEE,
  SOFT_REMOVE_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from './../schemas/employee/mutation.schema';
import {
  AUTH_EMPLOYEES,
  DELETED_EMPLOYEES,
  EMPLOYEE,
  EMPLOYEES,
} from '../schemas/employee/query.schema';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { createProblemClotheInput } from '../interfaces/cloth-problem.interface';

@Injectable()
export class EmployeeService {
  constructor(private readonly apollo: Apollo) {}

  public employee(id: number): Observable<any> {
    return this.apollo.watchQuery({
      query: EMPLOYEE,
      variables: { id },
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  public employees(): Observable<any> {
    return this.apollo.watchQuery({
      query: EMPLOYEES,
      variables: {},
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  public deletedEmployees(): Observable<any> {
    return this.apollo.watchQuery({
      query: DELETED_EMPLOYEES,
      variables: {},
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  public authEmployees(): Observable<any> {
    return this.apollo.watchQuery({
      query: AUTH_EMPLOYEES,
      variables: {},
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }).valueChanges;
  }

  public createEmployee(
    createEmployeeInput: createEmployeeInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_EMPLOYEE,
      variables: { createEmployeeInput },
      refetchQueries: [
        { query: EMPLOYEES, fetchPolicy: 'network-only', errorPolicy: 'all' },
        {
          query: DELETED_EMPLOYEES,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public updateEmployee(
    updateEmployeeInput: updateEmployeeInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: { updateEmployeeInput },
      refetchQueries: [
        { query: EMPLOYEES, fetchPolicy: 'network-only', errorPolicy: 'all' },
        {
          query: DELETED_EMPLOYEES,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
        {
          query: EMPLOYEES,
          variables: { id: updateEmployeeInput.id },
          errorPolicy: 'all',
          fetchPolicy: 'network-only',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public removeEmployee(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: REMOVE_EMPLOYEE,
      variables: { id },
      refetchQueries: [
        { query: EMPLOYEES, fetchPolicy: 'network-only', errorPolicy: 'all' },
        {
          query: DELETED_EMPLOYEES,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public softRemoveEmployee(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: SOFT_REMOVE_EMPLOYEE,
      variables: { id },
      refetchQueries: [
        { query: EMPLOYEES, fetchPolicy: 'network-only', errorPolicy: 'all' },
        {
          query: DELETED_EMPLOYEES,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public restoreEmployee(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: RESTORE_EMPLOYEE,
      variables: { id },
      refetchQueries: [
        { query: EMPLOYEES, fetchPolicy: 'network-only', errorPolicy: 'all' },
        {
          query: DELETED_EMPLOYEES,
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      ],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }
}
