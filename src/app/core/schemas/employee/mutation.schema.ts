import { gql } from 'apollo-angular';

export const CREATE_EMPLOYEE = gql`
  mutation createEmployee($createEmployeeInput: CreateEmployeeInput!) {
    createEmployee(createEmployeeInput: $createEmployeeInput) {
      id
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee($updateEmployeeInput: UpdateEmployeeInput!) {
    updateEmployee(updateEmployeeInput: $updateEmployeeInput) {
      id
      key
      firstName
      lastName
    }
  }
`;

export const REMOVE_EMPLOYEE = gql`
  mutation removeEmployee($id: Int!) {
    removeEmployee(id: $id) {
      id
    }
  }
`;

export const SOFT_REMOVE_EMPLOYEE = gql`
  mutation softRemoveEmployee($id: Int!) {
    softRemoveEmployee(id: $id) {
      id
    }
  }
`;
