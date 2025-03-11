import axios from "axios";
import toast from "react-hot-toast";
import { Product } from "../interfaces/productInterface";



const API_URL = "https://backend-develfood.vercel.app/products";


export const getProducts = async (): Promise<Product[]> => {
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


export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    toast.error("Erro ao carregar produto. Tente novamente.");
    throw error;
  }
};

export const productRegister = async (dishData: {
  name: string;
  image: string | null;
  description: string;
  price: string;
  foodTypes: string[];
}): Promise<Product> => {
  try {
    const response = await axios.post(API_URL, dishData);

    if (response.status === 200) {
      toast.success("Produto cadastrado com sucesso!");
      return response.data;
    }
    throw new Error("Resposta inesperada da API");
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    toast.error("Erro ao cadastrar produto. Tente novamente.");
    throw error;
  }
};


export const updateProduct = async (
  id: string,
  dishData: {
    name: string;
    description: string;
    price: string;
    foodTypes: string[];
    image?: string | null;
  }
): Promise<Product> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, dishData);

    if (response.status === 200) {
      toast.success("Produto atualizado com sucesso!");
      return response.data;
    }
    throw new Error("Resposta inesperada da API");
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    toast.error("Erro ao atualizar produto. Tente novamente.");
    throw error;
  }
};


export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
};