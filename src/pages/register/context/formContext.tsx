import React, { createContext, useContext, useState } from "react";
import { CreateRestaurantRequest } from "../../../services/createRestaurant";


interface FormContextType {
    formData: CreateRestaurantRequest
    setFormData: React.Dispatch<React.SetStateAction<CreateRestaurantRequest>>
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext deve ser usado dentro de um FormProvider")
    }
    return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<CreateRestaurantRequest>({
      cnpj: "",
      name: "",
      phone: "",
      email: "",
      password: "",
      foodTypes: [],
      nickname: "",
      zipcode: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      number: "",
    });
  
    return (
      <FormContext.Provider value={{ formData, setFormData }}>
        {children}
      </FormContext.Provider>
    );
  };