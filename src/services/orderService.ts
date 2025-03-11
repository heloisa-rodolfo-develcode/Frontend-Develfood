import { Order } from "../interfaces/orderInterface";
import { api } from "./api";
import toast from "react-hot-toast";

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get("/orders");
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error("Resposta inesperada da API");
    }
  } catch (error) {
    toast.error("Erro ao carregar pedidos. Tente novamente mais tarde.", {
      position: "bottom-right",
    });
    throw error; 
  }
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  try {
    const response = await api.patch(`/orders/${id}`, { status });
    return response.data;
  } catch (error) {
    toast.error("Erro ao atualizar status do pedido, tente novamente mais tarde.", {
      position: "bottom-right",
    });
    throw error; 
  }
};