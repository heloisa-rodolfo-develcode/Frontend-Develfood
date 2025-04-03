import axios from "axios";
import { api } from "../services/api"; 
import toast from 'react-hot-toast';

export type SignInForm = {
  email: string;
  password: string;
};

export async function authenticate(data: SignInForm) {
  try {
    const response = await api.post('/restaurant/auth', data); 

    if (response.status !== 200) {
      throw new Error('Usuário ou senha inválidos.');
    }

    const responseData = response.data;

    toast.success('Login realizado com sucesso!', {
      position: 'bottom-right',
      duration: 3000,
    });

    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || 'Erro inesperado na autenticação.';
      toast.error(errorMessage, { position: 'bottom-right' });
    } else {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro inesperado na autenticação.',
        { position: 'bottom-right' }
      );
    }
    return null;
  }
}