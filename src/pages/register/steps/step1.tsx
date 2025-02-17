import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Envelope, CreditCard, Lock, Eye, EyeSlash } from "phosphor-react";
import { Input } from "../../../components/input";
import { formatCNPJ } from "../../../utils/masks/maskCnpj";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFormContext } from "../context/formContext";
import { CreateRestaurantRequest } from "../../../services/createRestaurant";

const step1Schema = z
  .object({
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(
        /[!@#$%^&*(),.?":{}/<>]/,
        "A senha deve conter pelo menos um caractere especial"
      ),
    confirmPassword: z
      .string()
      .min(8, "A confirmação de senha deve ter pelo menos 8 caracteres"),
    cnpj: z
      .string()
      .min(14, "Cnpj deve ter 14 digitos")
      .refine(
        (val) => {
          const isValid = formatCNPJ(val);
          return isValid;
        },
        {
          message: "CNPJ inválido",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], 
  });

type SignUpFormData = z.infer<typeof step1Schema>;

export default function Step1({ onNext }: { onNext: () => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(step1Schema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      cnpj: "", 
      password: "", 
      confirmPassword: "", 
    },
  });

  const { setFormData } = useFormContext(); 

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = (data: Partial<CreateRestaurantRequest>) => {
    setFormData((prev) => ({ ...prev, ...data })); 
    onNext();
  };

  return (
    <div className="flex flex-col justify-center items-center bg-background gap-10">
      <img
        src="images/step/step1.svg"
        alt="step 1"
        className="w-[10rem] h-auto object-cover"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <Envelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="E-mail"
                className="w-[24rem] h-[3rem]"
                required
              />
            )}
          />
          {errors.email && (
            <span className="text-red-500">{String(errors.email.message)}</span>
          )}
        </div>

        <div className="relative mt-2">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Controller
            name="cnpj"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="CNPJ"
                className="h-[3rem]"
                required
                value={formatCNPJ(field.value || "")} 
                onChange={(e) => field.onChange(formatCNPJ(e.target.value))}
              />
            )}
          />
          {errors.cnpj && (
            <span className="text-red-500">{String(errors.cnpj.message)}</span>
          )}
        </div>

        <div className="relative mt-2">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="h-[3rem]"
                required
              />
            )}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <span className="text-red-500">
              {String(errors.password.message)}
            </span>
          )}
        </div>

        <div className="relative w-full mt-2">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                className="h-[3rem]"
                required
              />
            )}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
          {errors.confirmPassword && (
            <span className="text-red-500">
              {String(errors.confirmPassword.message)}
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="w-full mt-6 bg-primary text-white font-roboto py-2 px-18 rounded-lg cursor-pointer disabled:bg-gray-400"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="w-full mt-6 bg-primary text-white font-roboto py-2 px-16 rounded-lg cursor-pointer disabled:bg-gray-400"
            disabled={!isValid}
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}