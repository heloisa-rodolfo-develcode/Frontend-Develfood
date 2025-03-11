import axios from "axios";

const API_URL = "http://localhost:3000/restaurants"; 

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
      console.error("Restaurante não encontrado");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar perfil do restaurante:", error);
    return null;
  }
};


export const updateRestaurantProfile = async (
  id: number,
  data: RestaurantProfile 
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${id}`, data);
  } catch (error) {
    console.error("Erro ao atualizar perfil do restaurante:", error);
    throw new Error("Erro ao atualizar perfil do restaurante.");
  }
};