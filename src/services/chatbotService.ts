import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "https://leticia-develcode.app.n8n.cloud/webhook/IA-develfood";

export const ChatbotService = {
  async sendMessage(message: string, sessionId: string): Promise<string> {
    try {
      const response = await axios.post(API_URL, {
        name: "Restaurante Dona Maria",
        message: message,
        sessionId: sessionId 
      });
      return response.data;
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
      throw error;
    }
  }
};