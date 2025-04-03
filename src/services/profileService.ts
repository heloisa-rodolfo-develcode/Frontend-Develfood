import { DeleteAccountData, RestaurantProfile } from '../interfaces/profileInterface';
import { api } from './api';
import toast from 'react-hot-toast';


export const getRestaurantProfile = async (): Promise<RestaurantProfile> => {
  try {
    const response = await api.get('/restaurant/profile');
    return response.data;
  } catch (error) {
    toast.error("Erro ao buscar perfil do restaurante");
    throw error;
  }
};

export const updateRestaurantProfile = async (
  data: RestaurantProfile
): Promise<void> => {
  try {
    await api.put('/restaurant/update', data);
    toast.success("Perfil atualizado com sucesso!");
  } catch  {
    toast.error("Erro ao atualizar perfil do restaurante");
  }
};

export const updateRestaurantImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.put('/restaurant/update/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success("Imagem atualizada com sucesso!");
    return response.data.imageUrl; 
  } catch (error) {
    toast.error("Erro ao atualizar imagem do restaurante");
    throw error;
  }
};

export const deleteRestaurantAccount = async (
  data: DeleteAccountData
): Promise<void> => {
  try {
    await api.delete('/restaurant/delete', { data });
    toast.success("Conta excluída com sucesso!");
  } catch  {
    toast.error("Erro ao excluir conta do restaurante");
  }
};