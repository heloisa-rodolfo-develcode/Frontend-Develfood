
import { CreateRestaurantRequest } from "../interfaces/restaurantInterface";
import { api } from "../services/api";

export async function createRestaurant(data: CreateRestaurantRequest) {
  const response = await api.post("/restaurant/create", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }); 
  return response;
}