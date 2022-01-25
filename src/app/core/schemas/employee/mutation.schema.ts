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
