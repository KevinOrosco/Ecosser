// api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './axiosInstance';

// Interfaces
export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface ClientData {
  name: string;
  phone?: string;
  deuda: string | "0";
  owner_id: string;
  activo?: boolean;
}

export interface Product {
  id: string;
  product_name: string;
  quantity: string;
  owner_id: string;
  price: string;
  barcode: string;
  created?: string;
  updated?: string;
}

export interface VentaProduct extends Product {
  quantityInSale: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  deuda: string;
  owner_id: string;
  activo?: boolean;
  created?: string;
  updated?: string;
}

export interface Sale {
  id: string;
  owner_id: string;
  customer_id?: string; // opcional (null si es venta normal)
  total: string | "0";
  sale_type: "normal" | "fiado";
  created?: string;
  updated?: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created?: string;
}

// Tipos de respuesta
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface AuthResponse {
  token: string;
  record: User;
}

// Autenticación
export const registerUser = async (data: any): Promise<ApiResponse> => {
  try {
    const userData = {
      ...data,
      emailVisibility: true,
    };

    const response = await axiosInstance.post('/api/collections/users/records', userData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en registerUser:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const loginUser = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      '/api/collections/users/auth-with-password',
      {
        identity: email,
        password: password,
      }
    );

    const { token, record } = response.data;

    await AsyncStorage.setItem('pb_auth_token', token);

    try {
      await AsyncStorage.setItem('pb_auth_user', JSON.stringify(record));
    } catch (e) {
    }

    return { success: true, data: record };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(
      '/api/collections/users/records',
      {
        params: {
          filter: `(email='${email}')`,
          perPage: 1,
        }
      }
    );

    return response.data.items.length > 0;
  } catch (error) {
    console.error("Error al verificar email:", error);
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  return !!AsyncStorage.getItem('pb_auth_token');
};

export const logoutUser = (): void => {
  AsyncStorage.removeItem('pb_auth_token');
  AsyncStorage.removeItem('pb_auth_user');
};

// Funciones para productos
export const getProductsByOwner = async (clientId: string): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await axiosInstance.get('/api/collections/products/records', {
      params: {
        filter: `client_id = "${clientId}"`,
      },
    });

    return { success: true, data: response.data.items };
  } catch (error: any) {
    console.error("Error en getProductsByOwner:", error);
    return {
      success: false,
      error: "No se pudieron cargar los productos"
    };
  }
};

export const createProduct = async (productData: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/api/collections/products/records', productData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en createProduct:", error);
    return {
      success: false,
      error: "No se pudo agregar el producto"
    };
  }
};

export const updateProduct = async (id: string, data: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.patch(`/api/collections/products/records/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en updateProduct:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const deleteProduct = async (id: string): Promise<ApiResponse> => {
  try {
    await axiosInstance.delete(`/api/collections/products/records/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error en deleteProduct:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Funciones para productos
export const getClientsByOwner = async (tallerId: string): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await axiosInstance.get('/api/collections/clients/records', {
      params: {
        filter: `taller_id = "${tallerId}"`,
      },
    });

    return { success: true, data: response.data.items };
  } catch (error: any) {
    console.error("Error en getClientsByOwner:", error);
    return {
      success: false,
      error: "No se pudieron cargar los clientes"
    };
  }
};

export const createClient = async (productData: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/api/collections/clients/records', productData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en createClient:", error);
    return {
      success: false,
      error: "No se pudo agregar el producto"
    };
  }
};

export const updateClient = async (id: string, data: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.patch(`/api/collections/clients/records/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en updateClient:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const deleteClient = async (id: string): Promise<ApiResponse> => {
  try {
    await axiosInstance.delete(`/api/collections/clients/records/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error en deleteClient:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const getTalleresByOwner = async (ownerId: string): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await axiosInstance.get('/api/collections/talleres/records', {
      params: {
        filter: `owner_id = "${ownerId}"`,
      },
    });

    return { success: true, data: response.data.items };
  } catch (error: any) {
    console.error("Error en getTalleresByOwner:", error);
    return {
      success: false,
      error: "No se pudieron cargar los talleres"
    };
  }
};

export const createTaller = async (productData: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/api/collections/talleres/records', productData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en createTaller:", error);
    return {
      success: false,
      error: "No se pudo agregar el taller"
    };
  }
};

export const updateTaller = async (id: string, data: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.patch(`/api/collections/talleres/records/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en updateTaller:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const deleteTaller = async (id: string): Promise<ApiResponse> => {
  try {
    await axiosInstance.delete(`/api/collections/talleres/records/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error en deleteTaller:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};