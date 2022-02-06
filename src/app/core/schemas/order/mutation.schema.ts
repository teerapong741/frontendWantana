import { gql } from 'apollo-angular';

export const CREATE_ORDER = gql`
  mutation createOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      id
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation updateOrder($updateOrderInput: UpdateOrderInput!) {
    updateOrder(updateOrderInput: $updateOrderInput) {
      id
    }
  }
`;

export const REMOVE_ORDER = gql`
  mutation removeOrder($id: Int!) {
    removeOrder(id: $id) {
      key
    }
  }
`;
