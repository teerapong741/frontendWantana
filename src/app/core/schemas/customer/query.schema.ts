import { gql } from 'apollo-angular';

export const CUSTOMERS = gql`
  query customers {
    customers {
      id
      key
      idCard
      firstName
      lastName
      address
      phoneNumber
      lineUserId
      email
    }
  }
`;
