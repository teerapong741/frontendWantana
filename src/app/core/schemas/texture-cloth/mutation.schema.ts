import { gql } from 'apollo-angular';

export const CREATE_SORT_CLOTHE = gql`
  mutation createSortClothe($createSortClotheInput: CreateSortClotheInput!) {
    createSortClothe(createSortClotheInput: $createSortClotheInput) {
      id
      key
      name
    }
  }
`;

export const DISABLE_SORT_CLOTHE = gql`
  mutation updateSortClothe($updateSortClotheInput: UpdateSortClotheInput!) {
    updateSortClothe(updateSortClotheInput: $updateSortClotheInput) {
      id
    }
  }
`;
export const REMOVE_SORT_CLOTHE = gql`
  mutation removeSortClothe($id: Int!) {
    removeSortClothe(id: $id) {
      id
    }
  }
`;
