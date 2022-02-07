import { gql } from 'apollo-angular';

export const ORDER = gql`
  query order($id: Int!) {
    order(id: $id) {
      id
      status
      isOutProcess
      clothes {
        id
        key
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
        specialClothe {
          id
          key
          name
        }
        clotheHasProblems {
          id
          status
          problemClothe {
            id
            name
          }
        }
      }
    }
  }
`;

export const ORDERS = gql`
  query orders {
    orders {
      id
      key
      status
      created_at
      updated_at
      primaryOrderId
      numClothe
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

export const PRIMARY_ORDERS = gql`
  query primaryOrders {
    primaryOrders {
      id
      status
      isOutProcess
      key
      created_at
      updated_at
      primaryOrderId
      numClothe
      clothes {
        id
        key
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
        specialClothe {
          id
          key
          name
        }
        clotheHasProblems {
          id
          status
          problemClothe {
            id
            name
          }
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

export const FIND_ONE_BY_PRIMARY_ID = gql`
  query findOneByPrimaryId($id: Int!) {
    findOneByPrimaryId(id: $id) {
      id
      status
      isOutProcess
      key
      created_at
      updated_at
      primaryOrderId
      numClothe
      clothes {
        id
        key
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
        specialClothe {
          id
          key
          name
        }
        clotheHasProblems {
          id
          status
          problemClothe {
            id
            name
          }
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
