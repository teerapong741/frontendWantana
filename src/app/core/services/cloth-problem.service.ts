import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { createProblemClotheInput } from '../interfaces/cloth-problem.interface';
import {
  CREATE_PROBLEM_CLOTHE,
  REMOVE_PROBLEM_CLOTHE,
} from '../schemas/cloth-problem/mutation.schema';
import { PROBLEM_CLOTHES } from '../schemas/cloth-problem/query.schema';

@Injectable()
export class ClothProblemService {
  constructor(private apollo: Apollo) {}

  public problemClothes(): Observable<any> {
    return this.apollo.watchQuery({
      query: PROBLEM_CLOTHES,
      errorPolicy: 'all',
    }).valueChanges;
  }

  public createProblemClothe(
    createProblemClotheInput: createProblemClotheInput
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_PROBLEM_CLOTHE,
      variables: { createProblemClotheInput },
      refetchQueries: [{ query: PROBLEM_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }

  public removeProblemClothe(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: REMOVE_PROBLEM_CLOTHE,
      variables: { id },
      refetchQueries: [{ query: PROBLEM_CLOTHES, errorPolicy: 'all' }],
      awaitRefetchQueries: true,
      errorPolicy: 'all',
    });
  }
}
