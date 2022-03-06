import { gql } from 'apollo-angular';

export const EMPLOYEE = gql`
  query employee($id: Int!) {
    employee(id: $id) {
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
      proVince
      disTrict
      postalCode
    }
  }
`;

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
      proVince
      disTrict
      postalCode
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
