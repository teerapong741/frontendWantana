import {
  CREATE_CLOTHE,
  CREATE_CLOTHE_HAS_PROBLEM,
  UPDATE_CLOTHE,
} from './../schemas/cloth/mutation.schema';
import {
  CreateClotheInput,
  CreateClotheProblemInput,
  UpdateClotheInput,
} from './../interfaces/cloth.interface';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ClothService {
  constructor(private readonly apollo: Apollo) {}

  public createClothe(createClotheInput: CreateClotheInput): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_CLOTHE,
      variables: { createClotheInput },
      refetchQueries: [],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public updateClothe(updateClotheInput: UpdateClotheInput): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_CLOTHE,
      variables: { updateClotheInput },
      refetchQueries: [],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public createClotheHasProblem(
    createClotheProblemInput: CreateClotheProblemInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_CLOTHE_HAS_PROBLEM,
      variables: { createClotheProblemInput },
      refetchQueries: [],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }
}
