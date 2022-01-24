import { gql } from 'apollo-angular';

export const TYPE_CLOTHES = gql`
  query typeClothes {
    typeClothes {
      id
      key
      name
    }
  }
`;
