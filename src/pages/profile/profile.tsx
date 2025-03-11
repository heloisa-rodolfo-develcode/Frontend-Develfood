import { useState, useEffect, useRef } from "react";
import {
  User,
  Phone,
  ForkKnife,
  CaretDown,
  House,
  CreditCard,
  Envelope,
  Image,
} from "phosphor-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { maskZipcode } from "../../utils/masks/maskZipcode";
import { Input } from "../../components/input";
import { formatPhone } from "../../utils/masks/maskPhone";

import { formatCNPJ } from "../../utils/masks/maskCnpj";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getRestaurantProfile, updateRestaurantProfile } from "../../services/profileService";

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cnpj: z
    .string()
    .min(14, "CNPJ deve ter 14 dígitos")
    .refine(
      (val) => {
        const isValid = formatCNPJ(val);
        return isValid;
      },
      {
        message: "CNPJ inválido",
      }
    ),
  phone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
  foodTypes: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo de comida")
    .max(2, "Selecione no máximo dois tipos de comida"),
  nickname: z.string().min(1, "O apelido do endereço é obrigatório"),
  zipcode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  street: z.string().min(1, "A rua é obrigatória"),
  city: z.string().min(1, "A cidade é obrigatória"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  state: z.string().min(1, "O estado é obrigatório"),
  number: z.string().min(1, "O número é obrigatório"),
});

type FormData = z.infer<typeof schema>;

const foodTypes = [
  { label: "Brasileira", value: "brasileira" },
  { label: "Picante", value: "picante" },
  { label: "Mexicana", value: "mexicana" },
  { label: "Japonesa", value: "japonesa" },
];

export function Profile() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      cnpj: "",
      phone: "",
      foodTypes: [],
      nickname: "",
      zipcode: "",
      street: "",
      city: "",
      neighborhood: "",
      state: "",
      number: "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getRestaurantProfile("12345678901234");
  
      if (profile) {
        setValue("name", profile.name);
        setValue("email", profile.email);
        setValue("phone", profile.phone);
        setValue("cnpj", profile.cnpj);
        setValue("foodTypes", profile.foodTypes);
        setValue("nickname", profile.nickname);
        setValue("zipcode", profile.zipcode);
        setValue("street", profile.street);
        setValue("city", profile.city);
        setValue("neighborhood", profile.neighborhood);
        setValue("state", profile.state);
        setValue("number", profile.number);
  
        setSelectedFoods(profile.foodTypes);
      } else {
        console.error("Perfil não encontrado ou erro ao carregar.");
      }
    };
  
    fetchProfile();
  }, [setValue]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (value: string) => {
    const newSelectedFoods = selectedFoods.includes(value)
      ? selectedFoods.filter((item) => item !== value)
      : selectedFoods.length < 2
      ? [...selectedFoods, value]
      : selectedFoods;

    setSelectedFoods(newSelectedFoods);
    setValue("foodTypes", newSelectedFoods, { shouldValidate: true });
  };

  const fetchAddressByZipcode = async (zipcode: string) => {
    const cleanZipcode = zipcode.replace(/\D/g, "");
    if (cleanZipcode.length === 8) {
      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cep/v1/${cleanZipcode}`
        );
        const data = await response.json();
        if (!data?.errors) {
          setValue("street", data.street || "");
          setValue("neighborhood", data.neighborhood || "");
          setValue("city", data.city || "");
          setValue("state", data.state || "");
        } else {
          console.error("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar endereço:", error);
      }
    }
  };

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, "");
    const maskedValue = maskZipcode(rawValue);
    setValue("zipcode", maskedValue, { shouldValidate: true });
    if (rawValue.length === 8) {
      fetchAddressByZipcode(rawValue);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem não pode ser maior que 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const id = 1; 
      await updateRestaurantProfile(id, data); 
      toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      toast.error("Erro ao atualizar perfil:" + error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mx-auto p-30">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-gray-300 flex flex-col items-center justify-center rounded-lg overflow-hidden relative">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Imagem selecionada"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <Image size={50} className="text-gray-500" />
                    <span className="text-gray-500">Adicionar imagem</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-3 w-full mt-4">
              <div className="relative w-full">
                <Envelope
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="E-mail"
                      className="w-full pl-10 h-[3rem]"
                      disabled
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>

              <div className="relative w-full">
                <CreditCard
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="cnpj"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="CNPJ"
                      className="w-full pl-10 h-[3rem]"
                      value={formatCNPJ(field.value || "")}
                      onChange={(e) =>
                        field.onChange(formatCNPJ(e.target.value))
                      }
                      disabled
                    />
                  )}
                />
                {errors.cnpj && (
                  <span className="text-red-500">
                    {String(errors.cnpj.message)}
                  </span>
                )}
              </div>

              <button className="mt-4 w-full cursor-pointer font-roboto bg-blue-900 text-white py-2 rounded-lg" onClick={() => navigate("/change-password")}>
                Alterar senha
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold font-roboto mb-4">
              Informações Gerais
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Nome do Restaurante"
                      className="w-full pl-10 h-[3rem]"
                    />
                  )}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>

              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Telefone"
                      className="w-full pl-10 h-[3rem]"
                      value={formatPhone(field.value || "")}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                    />
                  )}
                />
                {errors.phone && (
                  <span className="text-red-500">{errors.phone.message}</span>
                )}
              </div>

              <div className="relative" ref={dropdownRef}>
                <div
                  className="relative flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <ForkKnife
                    className="absolute left-3 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="text"
                    placeholder="Tipos de comida"
                    className="w-full pl-10 h-[3rem] cursor-pointer"
                    readOnly
                    value={
                      selectedFoods.length > 0 ? selectedFoods.join(", ") : ""
                    }
                  />
                  <CaretDown
                    className="absolute right-3 text-gray-400"
                    size={18}
                  />
                </div>
                {errors.foodTypes && (
                  <span className="text-red-500">
                    {errors.foodTypes.message}
                  </span>
                )}

                {isOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {foodTypes.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFoods.includes(option.value)}
                          onChange={() => handleCheckboxChange(option.value)}
                          className="mr-2"
                          disabled={
                            selectedFoods.length >= 2 &&
                            !selectedFoods.includes(option.value)
                          }
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold font-roboto mb-4">Endereço</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="nickname"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Apelido do endereço"
                      className="w-full pl-10 h-[3rem]"
                    />
                  )}
                />
                {errors.nickname && (
                  <span className="text-red-500">
                    {errors.nickname.message}
                  </span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="zipcode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="CEP"
                      className="w-full pl-10 h-[3rem]"
                      onChange={(e) => {
                        field.onChange(e);
                        handleZipCodeChange(e);
                      }}
                    />
                  )}
                />
                {errors.zipcode && (
                  <span className="text-red-500">{errors.zipcode.message}</span>
                )}
              </div>

              <div className="relative col-span-2">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Rua"
                      className="w-full pl-10 h-[3rem]"
                    />
                  )}
                />
                {errors.street && (
                  <span className="text-red-500">{errors.street.message}</span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Cidade"
                      className="w-full pl-10 h-[3rem]"
                    />
                  )}
                />
                {errors.city && (
                  <span className="text-red-500">{errors.city.message}</span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="neighborhood"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Bairro"
                      className="w-full pl-10 h-[3rem]"
                    />
                  )}
                />
                {errors.neighborhood && (
                  <span className="text-red-500">
                    {errors.neighborhood.message}
                  </span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Estado"
                      className="w-full pl-10 h-[3rem]"
                    />
                  )}
                />
                {errors.state && (
                  <span className="text-red-500">{errors.state.message}</span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Número"
                      className="w-full pl-10 h-[3rem]"
                    />
                  )}
                />
                {errors.number && (
                  <span className="text-red-500">{errors.number.message}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="mt-6 w-[24rem] cursor-pointer font-roboto bg-blue-900 text-white py-2 rounded-lg"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
