import axios from "axios";
import toast from "react-hot-toast";
import { Promotion } from "../interfaces/promotionInterface";


const API_URL = "https://backend-develfood-64x6.onrender.com/promotions";


export const getPromotion = async (): Promise<Promotion[]> => {
  try {
    const response = await axios.get(API_URL);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error("Resposta inesperada da API"); 
    }
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    throw error; 
  }
};


export const getPromotionById = async (id: string): Promise<Promotion> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar promoções:", error);
    toast.error("Erro ao carregar promoções. Tente novamente.");
    throw error;
  }
};

export const promotionRegister = async (promotionData: {
  name: string;
  image: string | null;
  percentage: string;
  start: string;
  end: string;
}): Promise<Promotion> => {
  try {
    const response = await axios.post(API_URL, promotionData);

    if (response.status === 200) {
      toast.success("Promoção cadastrada com sucesso!");
      return response.data;
    }
    throw new Error("Resposta inesperada da API");
  } catch (error) {
    console.error("Erro ao cadastrar promoção:", error);
    toast.error("Erro ao cadastrar promoção. Tente novamente.");
    throw error;
  }
};


export const updatePromotion = async (
  id: string,
  promotionData: {
    name: string;
    image: string | null;
    percentage: string;
    start: string;
    end: string;
  }
): Promise<Promotion> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, promotionData);

    if (response.status === 200) {
      toast.success("Promoção atualizada com sucesso!");
      return response.data;
    }
    throw new Error("Resposta inesperada da API");
  } catch (error) {
    console.error("Erro ao atualizar promoção:", error);
    toast.error("Erro ao atualizar promoção. Tente novamente.");
    throw error;
  }
};


export const deletePromotion = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Erro ao excluir promoção:", error);
    throw error;
  }
};