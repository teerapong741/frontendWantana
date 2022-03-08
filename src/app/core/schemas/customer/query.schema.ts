import { gql } from 'apollo-angular';

export const CUSTOMER = gql`
  query customer($id: Int!) {
    customer(id: $id) {
      id
      key
      idCard
      firstName
      lastName
      address
      phoneNumber
      lineUserId
      email
      subDistrict
      proVince
      disTrict
      postalCode
    }
  }
`;

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
      subDistrict
      proVince
      disTrict
      postalCode
      created_at
    }
  }
`;
