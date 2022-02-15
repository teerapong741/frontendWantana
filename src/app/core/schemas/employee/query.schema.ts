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
      deleted_at
      created_at
      updated_at
    }
  }
`;

export const DELETED_EMPLOYEES = gql`
  query deletedEmployees {
    deletedEmployees {
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
      deleted_at
      created_at
      updated_at
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
      role
      firstName
      lastName
      created_at
    }
  }
`;
