import { api } from "./api";

export interface CreateRestaurantRequest {
  cnpj: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  foodTypes: string[];
  nickname: string;
  zipcode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
}

export async function createRestaurant(data: CreateRestaurantRequest) {
  const response = await api.post("/restaurants", data); 
  return response;
}