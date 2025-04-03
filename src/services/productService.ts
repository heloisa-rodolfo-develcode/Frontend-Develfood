import { api } from "./api";
import toast from "react-hot-toast";
import { Product } from "../interfaces/productInterface";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/restaurant/foodMenu/get");
    return Array.isArray(response.data.content) ? response.data.content : [];
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    return [];
  }
};

export const getProductById = async (idRestaurant: string, idDish: string): Promise<Product> => {
  try {
    const response = await api.get(`/restaurant/foodMenu/get/${idRestaurant}/${idDish}`);
    
    if (response.data && response.data.id) {
      return response.data;
    } else {
      throw new Error("Estrutura do produto inválida");
    }
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    toast.error("Erro ao carregar produto. Tente novamente.");
    throw error;
  }
};

export const productRegister = async (dishData: {
  name: string;
  description: string;
  price: number;
  foodCategory: string; 
  file?: File; 
}): Promise<Product> => {
  try {
    const formData = new FormData();
    formData.append('dish', JSON.stringify({
      name: dishData.name,
      description: dishData.description,
      price: dishData.price,
      foodCategory: dishData.foodCategory
    }));
    
    if (dishData.file) {
      formData.append('file', dishData.file); 
    }

    const response = await api.post("/restaurant/foodMenu/create", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    toast.success("Produto cadastrado com sucesso!");
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    throw error;
  }
};

export const updateProduct = async (
  idDish: string,
  dishData: { // Objeto com os dados do prato (será stringificado)
    name: string;
    description: string;
    price: string;
    foodTypes: string[];
    available: boolean;
  },
  file?: File 
): Promise<Product> => {
  try {
    const formData = new FormData();

    formData.append(
      'dish',
      JSON.stringify(dishData) 
    );

    if (file) {
      formData.append('file', file);
    }
    const response = await api.put(
      `/restaurant/foodMenu/update/${idDish}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    toast.success("Produto atualizado com sucesso!");
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    toast.error("Erro ao atualizar produto. Tente novamente.");
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/restaurant/foodMenu/delete/${id}`);
    toast.success("Produto excluído com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
};