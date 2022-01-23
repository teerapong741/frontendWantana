import { AUTH_EMPLOYEES, EMPLOYEES } from '../schemas/employee/query.schema';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable()
export class EmployeeService {
  constructor(private readonly apollo: Apollo) {}

  public employees(): Observable<any> {
    return this.apollo.watchQuery({
      query: EMPLOYEES,
      variables: {},
      errorPolicy: 'all',
    }).valueChanges;
  }

  public authEmployees(): Observable<any> {
    return this.apollo.watchQuery({
      query: AUTH_EMPLOYEES,
      variables: {},
      errorPolicy: 'all',
    }).valueChanges;
  }
}
