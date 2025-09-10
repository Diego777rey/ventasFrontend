import { gql } from "apollo-angular";

export const GET_CATEGORIAS = gql`
  query GetAllCategorias {
    findAllCategorias {
      id
      descripcion
    }
  }
`;
export const GET_CATEGORIA_BY_ID = gql`
  query GetCategoriaById($id: ID!) {
    findCategoriaById(CategoriaId: $id) {
      id
      descripcion
    }
  }
`;

export const CREATE_CATEGORIA = gql`
  mutation CreateCategoria($input: InputCategoria!) {
    createCategoria(inputCategoria: $input) {
      id
      descripcion
    }
  }
`;
export const UPDATE_CATEGORIA = gql`
  mutation UpdateCategoria($id: ID!, $input: InputCategoria!) {
    updateCategoria(id: $id, inputCategoria: $input) {
      id
      descripcion
    }
  }
`;
export const DELETE_CATEGORIA = gql`
  mutation DeleteCategoria($id: ID!) {
    deleteCategoria(id: $id) {
      id
    }
  }
`;