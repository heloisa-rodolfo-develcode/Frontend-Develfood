import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "https://backend-develfood-64x6.onrender.com/restaurants"; 

interface RestaurantProfile {
  name: string;
  email: string;
  cnpj: string;
  phone: string;
  foodTypes: string[];
  nickname: string;
  zipcode: string;
  street: string;
  city: string;
  neighborhood: string;
  state: string;
  number: string;
}

export const getRestaurantProfile = async (cnpj: string): Promise<RestaurantProfile | null> => {
  try {
    const response = await axios.get(`${API_URL}?cnpj=${cnpj}`);
    if (response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error("Restaurante não encontrado");
    }
  } catch {
    toast.error("Erro ao buscar perfil do restaurante");
    return null
  }
};

export const updateRestaurantProfile = async (
  cnpj: string,
  data: RestaurantProfile 
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${cnpj}`, data);
    toast.success("Perfil atualizado com sucesso!")
  } catch {
    toast.error("Erro ao atualizar perfil do restaurante");
  }
};