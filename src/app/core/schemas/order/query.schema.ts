import { gql } from 'apollo-angular';

export const ORDERS = gql`
  query orders {
    orders {
      id
      key
      status
      created_at
      updated_at
      clothes {
        id
        key
        created_at
        updated_at
        typeClothe {
          id
          key
          name
        }
        sortClothe {
          id
          key
          name
        }
      }
      employee {
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
      customer {
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
  }
`;
