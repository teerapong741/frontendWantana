import { gql } from 'apollo-angular';

export const CREATE_CLOTHE_HAS_PROBLEM = gql`
  mutation createClotheHasProblem(
    $createClotheProblemInput: CreateClotheProblemInput!
  ) {
    createClotheHasProblem(createClotheProblemInput: $createClotheProblemInput)
  }
`;

export const CREATE_CLOTHE = gql`
  mutation createClothe($createClotheInput: CreateClotheInput!) {
    createClothe(createClotheInput: $createClotheInput) {
      id
    }
  }
`;

export const UPDATE_CLOTHE = gql`
  mutation updateClothe($updateClotheInput: UpdateClotheInput!) {
    updateClothe(updateClotheInput: $updateClotheInput)
  }
`;

export const REMOVE_CLOTHE = gql`
  mutation removeClothe($id: Int!) {
    removeClothe(id: $id) {
      id
    }
  }
`;
