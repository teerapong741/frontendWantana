import { gql } from 'apollo-angular';

export const SORT_CLOTHES = gql`
  query sortClothes {
    sortClothes {
      id
      key
      name
    }
  }
`;
