import { gql } from 'apollo-angular';

export const CREATE_PROBLEM_CLOTHE = gql`
  mutation createProblemClothe(
    $createProblemClotheInput: CreateProblemClotheInput!
  ) {
    createProblemClothe(createProblemClotheInput: $createProblemClotheInput) {
      id
      key
      name
    }
  }
`;

export const REMOVE_PROBLEM_CLOTHE = gql`
  mutation removeProblemClothe($id: Int!) {
    removeProblemClothe(id: $id) {
      id
    }
  }
`;
