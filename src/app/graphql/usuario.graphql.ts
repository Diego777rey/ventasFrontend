import { gql } from "apollo-angular";
export const GET_USUARIOS = gql`
  query GetAllUsuarios {
    findAllUsuarios {
      id
      nombre
      contrasenha
    }
  }
`;
export const GET_USUARIO_BY_ID = gql`
  query GetUsuarioById($id: ID!) {
    findUsuarioById(UsuarioId: $id) {
      id
      nombre
      contrasenha
    }
  }
`;

export const CREATE_USUARIO = gql`
  mutation CreateUsuario($input: InputUsuario!) {
    createUsuario(inputUsuario: $input) {
      id
      nombre
      contrasenha
    }
  }
`;
export const UPDATE_USUARIO = gql`
  mutation UpdateUsuario($id: ID!, $input: InputUsuario!) {
    updateUsuario(id: $id, inputUsuario: $input) {
      id
      nombre
      contrasenha
    }
  }
`;
export const DELETE_USUARIO = gql`
  mutation DeleteUsuario($id: ID!) {
    deleteUsuario(id: $id) {
      id
    }
  }
`;