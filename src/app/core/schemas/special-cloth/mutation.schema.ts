import { gql } from 'apollo-angular';

export const CREATE_SPECIAL_CLOTHE = gql`
  mutation createSpecialClothe(
    $createSpecialClotheInput: CreateSpecialClotheInput!
  ) {
    createSpecialClothe(createSpecialClotheInput: $createSpecialClotheInput) {
      id
    }
  }
`;

export const DISABLE_SPECIAL_CLOTHE = gql`
  mutation updateSpecialClothe(
    $updateSpecialClotheInput: UpdateSpecialClotheInput!
  ) {
    updateSpecialClothe(updateSpecialClotheInput: $updateSpecialClotheInput) {
      id
    }
  }
`;

export const REMOVE_SPECIAL_CLOTHE = gql`
  mutation removeSpecialClothe($id: Int!) {
    removeSpecialClothe(id: $id) {
      id
    }
  }
`;
