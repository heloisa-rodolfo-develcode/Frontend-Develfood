export interface CreateRestaurantRequest {
    cnpj: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    types: string[]; 
    address: {
      nickname: string;
      zipcode: string;
      street: string;
      neighborhood: string;
      city: string;
      state: string;
      number: string;
    };
  }