import { House } from "phosphor-react";
import { Input } from "../../../components/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormContext } from "../context/formContext";

import { maskZipcode } from "../../../utils/masks/maskZipcode";
import { CreateRestaurantRequest } from "../../../services/createRestaurant";

const schema = z.object({
  nickname: z.string().min(1, "O apelido do endereço é obrigatório"),
  zipcode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  street: z.string().min(1, "A rua é obrigatória"),
  city: z.string().min(1, "A cidade é obrigatória"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  state: z.string().min(1, "O estado é obrigatório"),
  number: z.string().min(1, "O número é obrigatório"),
});

type SchemaStep3 = z.infer<typeof schema>;


interface Step3Props {
  onSubmit: (data: CreateRestaurantRequest) => Promise<void>; 
  onBack: () => void; 
}

export default function Step3({ onSubmit, onBack }: Step3Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<SchemaStep3>({
    resolver: zodResolver(schema),
    mode: "onBlur", 
  });

  const fetchAddressByZipcode = async (zipcode: string) => {
    const cleanZipcode = zipcode.replace(/\D/g, '') 
    if (cleanZipcode.length === 8) { 
      try {
        const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanZipcode}`)
        const data = await response.json()
        if (!data?.errors) {
         
          setValue('street', data.street || '')
          setValue('neighborhood', data.neighborhood || '')
          setValue('city', data.city || '')
          setValue('state', data.state || '')
        } else {
          console.error('CEP não encontrado')
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error)
      }
    }
  }
  
  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, '') 
    const maskedValue = maskZipcode(rawValue) 
    setValue('zipcode', maskedValue, { shouldValidate: true }) 
    if (rawValue.length === 8) {
      fetchAddressByZipcode(rawValue) 
    }
  }

  const { formData } = useFormContext(); 

  const handleFormSubmit = async (data: Partial<CreateRestaurantRequest>) => {
    try {
      const completeData = { ...formData, ...data };

      await onSubmit(completeData as CreateRestaurantRequest);
    } catch (error) {
      console.error("Erro ao criar restaurante:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-background gap-10">
      <img src="images/step/step3.svg" alt="step 3" className="w-[10rem] object-cover" />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-md flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="relative flex flex-col w-full">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Controller
              name="nickname"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Apelido do endereço"
                  className="pl-10 h-[3rem]"
                  required
                />
              )}
            />
            {errors.nickname && (
              <span className="h-0 text-red-500 text-sm ">{errors.nickname.message}</span>
            )}
          </div>
          <div className="relative w-full">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Controller
              name="zipcode"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="CEP"
                  className="pl-10 h-[3rem]"
                  required
                  onChange={(e) => {
                    field.onChange(e); 
                    handleZipCodeChange(e); 
                  }}
                />
              )}
            />
            {errors.zipcode && (
              <span className="text-red-500 text-sm">{String(errors.zipcode.message)}</span>
            )}
          </div>
        </div>

        <div className="relative w-full">
          <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Rua"
                className="pl-10 h-[3rem]"
                required
              />
            )}
          />
          {errors.street && (
            <span className="h-1 text-red-500 text-sm">{String(errors.street.message)}</span>
          )}
        </div>

        <div className="relative w-full">
          <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Cidade"
                className="pl-10 h-[3rem]"
                required
              />
            )}
          />
          {errors.city && (
            <span className="text-red-500 text-sm">{String(errors.city.message)}</span>
          )}
        </div>

        <div className="relative w-full">
          <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Controller
            name="neighborhood"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Bairro"
                className="pl-10 h-[3rem]"
                required
              />
            )}
          />
          {errors.neighborhood && (
            <span className="text-red-500 text-sm">{String(errors.neighborhood.message)}</span>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex flex-col justify-center w-full">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Estado"
                  className="pl-10 h-[3rem]"
                  required
                />
              )}
            />
            {errors.state && (
              <span className="h-1 text-red-500 text-sm">{String(errors.state.message)}</span>
            )}
          </div>
          <div className="relative flex flex-col justify-center w-full">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Número"
                  className="pl-10 h-[3rem]"
                  required
                />
              )}
            />
            {errors.number && (
              <span className="h-0 text-red-500 text-sm">{String(errors.number.message)}</span>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="w-full mt-6 bg-primary text-white font-roboto py-2 px-18 rounded-lg cursor-pointer disabled:bg-gray-400"
            onClick={onBack}
          >
            Voltar
          </button>
          <button
            type="submit"
            className="w-full mt-6 bg-primary text-white font-roboto py-2 px-16 rounded-lg cursor-pointer disabled:bg-gray-400"
            disabled={!isValid}
          >
            Finalizar
          </button>
        </div>
      </form>
    </div>
  );
}