
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
    name: string;
    phone: string;
    types: string[];
    address: RestaurantAddress;
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