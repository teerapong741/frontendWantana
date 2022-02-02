import { gql } from 'apollo-angular';

export const CREATE_CLOTHE = gql`
  mutation createClothe($createClotheInput: CreateClotheInput!) {
    createClothe(createClotheInput: $createClotheInput) {
      id
    }
  }
`;

export const UPDATE_CLOTHE = gql`
  mutation updateClothe($updateClotheInput: UpdateClotheInput!) {
    updateClothe(updateClotheInput: $updateClotheInput) {
      id
    }
  }
`;

export const REMOVE_CLOTHE = gql`
  mutation removeClothe($id: Int!) {
    removeClothe(id: $id) {
      id
    }
  }
`;
