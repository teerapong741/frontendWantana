import { gql } from 'apollo-angular';

export const CREATE_TYPE_CLOTHE = gql`
  mutation createTypeClothe($createTypeClotheInput: CreateTypeClotheInput!) {
    createTypeClothe(createTypeClotheInput: $createTypeClotheInput) {
      id
      key
      name
    }
  }
`;

export const REMOVE_TYPE_CLOTHE = gql`
  mutation removeTypeClothe($id: Int!) {
    removeTypeClothe(id: $id) {
      id
    }
  }
`;
