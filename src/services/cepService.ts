import toast from "react-hot-toast";

  export const fetchAddressByZipcode = async (zipcode: string) => {
    const cleanZipcode = zipcode.replace(/\D/g, "");
    if (cleanZipcode.length === 8) {
      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cep/v1/${cleanZipcode}`
        );
        const data = await response.json();
        if (!data?.errors) {
          return data 
        } else {
          toast.error("CEP não encontrado");
        }
      } catch {
        toast.error("Erro na requisição");
      }
    }
  };
