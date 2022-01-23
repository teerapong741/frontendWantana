import { gql } from 'apollo-angular';

export const EMPLOYEES = gql`
  query employees {
    employees {
      id
      key
      idCard
      firstName
      lastName
      address
      phoneNumber
      email
      password
      role
    }
  }
`;

export const AUTH_EMPLOYEES = gql`
  query employees {
    employees {
      id
      key
      email
      password
    }
  }
`;
