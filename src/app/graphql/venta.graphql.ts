import { gql } from "apollo-angular";

export const GET_VENTAS = gql`
  query GetAllVentas {
    findAllVentas {
   id
    fecha
    tipoPago
    cliente {
      id
      nombre
      apellido
    }
    vendedor {
      id
      nombre
      apellido
    }
    items {
      id
      cantidad
      precio
      producto {
        id
        descripcion
        precioVenta
      }
    }
  }
}
`;
export const GET_VENTAS_BY_ID = gql`
  query GetVentaById($ventaId: ID!) {
    findVentaById(ventaId: $ventaId) {
   id
    fecha
    tipoPago
    cliente {
      id
      nombre
      apellido
    }
    vendedor {
      id
      nombre
      apellido
    }
    items {
      id
      cantidad
      precio
      producto {
        id
        descripcion
        precioVenta
      }
    }
  }
}
`;

export const CREATE_VENTA = gql`
  mutation CreateVenta($input: InputVenta!) {
    createVenta(inputVenta: $input) {
   id
    fecha
    tipoPago
    cliente {
      id
      nombre
      apellido
    }
    vendedor {
      id
      nombre
      apellido
    }
    items {
      id
      cantidad
      precio
      producto {
        id
        descripcion
        precioVenta
      }
    }
  }
}
`;
export const UPDATE_VENTA = gql`
  mutation UpdateVenta($id: ID!, $input: InputVenta!) {
    updateVenta(id: $id, inputVenta: $input) {
   id
    fecha
    tipoPago
    cliente {
      id
      nombre
      apellido
    }
    vendedor {
      id
      nombre
      apellido
    }
    items {
      id
      cantidad
      precio
      producto {
        id
        descripcion
        precioVenta
      }
    }
  }
}
`;
export const DELETE_VENTA = gql`
  mutation DeleteVenta($id: ID!) {
    deleteVenta(id: $id) {
      id
    }
  }
`;