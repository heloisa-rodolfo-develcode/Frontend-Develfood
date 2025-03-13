import axios from "axios";
import { Order } from "../interfaces/orderInterface";
import toast from "react-hot-toast";

const API_URL = "https://backend-develfood-64x6.onrender.com/orders";

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(API_URL);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error("Resposta inesperada da API");
    }
  } catch {
    toast.error("Erro ao carregar pedidos"); 
    return []
  }
};


export const updateOrderStatus = async (id: number, status: string): Promise<Order | null> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, { status });
    return response.data;
  } catch {
    toast.error("Erro ao atualizar status do pedido"); 
    return null 
  }
};