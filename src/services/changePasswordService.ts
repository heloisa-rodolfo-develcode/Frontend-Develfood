import { api } from './api';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post('/restaurant/forgottenPassword', { email });

    if (response.status === 200) {
      toast.success('E-mail enviado com sucesso! Verifique sua caixa de entrada.');
      return true;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      toast.error('E-mail não encontrado');
    } else {
      toast.error('Erro ao enviar o e-mail. Tente novamente.');
    }
    return false;
  }
};

export const updateRestaurantPassword = async (
  email: string,
  token: string,
  newPassword: string
) => {
  try {
    const response = await api.put('/restaurant/newPassword', {
      email,
      code: token,
      newPassword,
    });

    if (response.status === 200) {
      toast.success('Senha redefinida com sucesso!');
      return true;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 400) {
        toast.error('Token inválido ou expirado.');
      } else if (error.response?.status === 403) {
        toast.error('Erro de permissão! Você não tem permissão para redefinir a senha.');
      } else {
        toast.error('Erro ao redefinir a senha. Tente novamente.');
      }
    } else {
      toast.error('Erro desconhecido. Tente novamente.');
    }
    return false;
  }
};