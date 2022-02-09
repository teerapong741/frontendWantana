import { gql } from 'apollo-angular';

export const SPECIAL_CLOTHES = gql`
  query specialClothes {
    specialClothes {
      id
      key
      name
      isDisable
    }
  }
`;
