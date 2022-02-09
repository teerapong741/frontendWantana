import {
  createSortClotheInput,
  UpdateSortClotheInput,
} from './../interfaces/texture-cloth.interface';
import { SORT_CLOTHES } from './../schemas/texture-cloth/query.schema';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import {
  CREATE_SORT_CLOTHE,
  DISABLE_SORT_CLOTHE,
  REMOVE_SORT_CLOTHE,
} from '../schemas/texture-cloth/mutation.schema';

@Injectable()
export class TextureClothService {
  constructor(private apollo: Apollo) {}

  public sortClothes(): Observable<any> {
    return this.apollo.watchQuery({
      query: SORT_CLOTHES,
      errorPolicy: 'all',
    }).valueChanges;
  }

  public createSortClothe(
    createSortClotheInput: createSortClotheInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_SORT_CLOTHE,
      variables: { createSortClotheInput },
      refetchQueries: [{ query: SORT_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public disableSortClothe(
    updateSortClotheInput: UpdateSortClotheInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: DISABLE_SORT_CLOTHE,
      variables: { updateSortClotheInput },
      refetchQueries: [{ query: SORT_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public removeSortClothe(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: REMOVE_SORT_CLOTHE,
      variables: { id },
      refetchQueries: [{ query: SORT_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }
}
