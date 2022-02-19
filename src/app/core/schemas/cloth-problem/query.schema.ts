import { gql } from 'apollo-angular';

export const PROBLEM_CLOTHES = gql`
  query problemClothes {
    problemClothes {
      id
      key
      name
      isDisable

    }
  }
`;
