import {
  CREATE_TYPE_CLOTHE,
  REMOVE_TYPE_CLOTHE,
} from '../schemas/type-cloth/mutation.schema';
import { createTypeClotheInput } from '../interfaces/type-cloth.interface';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { TYPE_CLOTHES } from '../schemas/type-cloth/query.schema';

@Injectable()
export class TypeClothService {
  constructor(private apollo: Apollo) {}

  public typeClothes(): Observable<any> {
    return this.apollo.watchQuery({
      query: TYPE_CLOTHES,
      errorPolicy: 'all',
    }).valueChanges;
  }

  public createTypeClothe(
    createTypeClotheInput: createTypeClotheInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_TYPE_CLOTHE,
      variables: { createTypeClotheInput },
      refetchQueries: [{ query: TYPE_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public removeTypeClothe(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: REMOVE_TYPE_CLOTHE,
      variables: { id },
      refetchQueries: [{ query: TYPE_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }
}
