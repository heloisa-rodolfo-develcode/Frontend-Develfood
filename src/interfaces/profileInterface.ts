
export interface RestaurantAddress {
    nickname: string;
    zipcode: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    number: string;
  }
  
  export interface RestaurantProfile {
    id?: string; // tornando opcional
    email?: string; // tornando opcional
    cnpj?: string; // tornando opcional
    phone: string;
    address: {
        zipcode: string;
        number: string;
        state: string;
        nickname: string;
        street: string;
        city: string;
        neighborhood: string;
    };
    name: string;
    types: string[];
    imageUrl?: string;
}
  
  export interface RestaurantProfileResponse {
    name: string;
    email: string;
    cnpj: string;
    phone: string;
    types: string[];
    address: RestaurantAddress;
    imageUrl?: string; 
  }
  
  export interface DeleteAccountData {
    password: string;
  }
  

  export interface UserProps {
    email: string;
    cnpj: string;

  }