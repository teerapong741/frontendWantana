import {
  CREATE_SPECIAL_CLOTHE,
  DISABLE_SPECIAL_CLOTHE,
  REMOVE_SPECIAL_CLOTHE,
} from './../schemas/special-cloth/mutation.schema';
import {
  createSpecialClotheInput,
  UpdateSpecialClotheInput,
} from './../interfaces/special-cloth.interface';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { SPECIAL_CLOTHES } from '../schemas/special-cloth/query.schema';

@Injectable()
export class SpecialClothService {
  constructor(private apollo: Apollo) {}

  public specialClothes(): Observable<any> {
    return this.apollo.watchQuery({
      query: SPECIAL_CLOTHES,
      errorPolicy: 'all',
    }).valueChanges;
  }

  public createSpecialClothe(
    createSpecialClotheInput: createSpecialClotheInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_SPECIAL_CLOTHE,
      variables: { createSpecialClotheInput },
      refetchQueries: [{ query: SPECIAL_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public disableSpecialClothe(
    updateSpecialClotheInput: UpdateSpecialClotheInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: DISABLE_SPECIAL_CLOTHE,
      variables: { updateSpecialClotheInput },
      refetchQueries: [{ query: SPECIAL_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public removeSpecialClothe(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: REMOVE_SPECIAL_CLOTHE,
      variables: { id },
      refetchQueries: [{ query: SPECIAL_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }
}
