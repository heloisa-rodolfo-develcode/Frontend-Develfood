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
  Trash,
} from "phosphor-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { maskZipcode } from "../../utils/masks/maskZipcode";
import { Input } from "../../components/input";
import { formatPhone } from "../../utils/masks/maskPhone";
import {
  getRestaurantProfile,
  updateRestaurantProfile,
  updateRestaurantImage,
  deleteRestaurantAccount,
} from "../../services/profileService";
import { formatCNPJ } from "../../utils/masks/maskCnpj";
import { useNavigate } from "react-router-dom";
import { fetchAddressByZipcode } from "../../services/cepService";
import toast, { Toaster } from "react-hot-toast";
import { RestaurantProfile } from "../../interfaces/profileInterface";

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
  types: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo de comida")
    .max(2, "Selecione no máximo dois tipos de comida"),
  address: z.object({
    nickname: z.string().min(1, "O apelido do endereço é obrigatório"),
    zipcode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
    street: z.string().min(1, "A rua é obrigatória"),
    city: z.string().min(1, "A cidade é obrigatória"),
    neighborhood: z.string().min(1, "O bairro é obrigatório"),
    state: z.string().min(1, "O estado é obrigatório"),
    number: z.string().min(1, "O número é obrigatório"),
  }),
});

type FormData = z.infer<typeof schema>;

const types = [
  { label: "Mexicana", value: "MEXICAN" },
  { label: "Chinesa", value: "CHINESE" },
  { label: "Italiana", value: "ITALIAN" },
  { label: "Snacks", value: "SNACKS" },
  { label: "Arabe", value: "ARABIC" },
  { label: "Açai", value: "AÇAÍ" },
  { label: "Drink", value: "DRINK" },
  { label: "Dessert", value: "DESSERT" },
  { label: "Japonesa", value: "JAPONESE" },
  { label: "Healthy", value: "HEALTHY" },
  { label: "Barbecue", value: "BARBECUE" },
  { label: "Brasileira", value: "BRAZILIAN" },
  { label: "Pizza", value: "PIZZA" },
  { label: "Hamburger", value: "HAMBURGER" },
];

export function Profile() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      phone: "",
      types: [],
      address: {
        nickname: "",
        zipcode: "",
        street: "",
        city: "",
        neighborhood: "",
        state: "",
        number: "",
      },
    },
  });


  const [isOpen, setIsOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantData, setRestaurantData] = useState<RestaurantProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getRestaurantProfile();
        setRestaurantData(profile); 
  
        setValue("name", profile.name);
        setValue("phone", profile.phone);
        setValue("types", profile.types);
        
        setValue("address.nickname", profile.address.nickname);
        setValue("address.zipcode", profile.address.zipcode);
        setValue("address.street", profile.address.street);
        setValue("address.city", profile.address.city);
        setValue("address.neighborhood", profile.address.neighborhood);
        setValue("address.state", profile.address.state);
        setValue("address.number", profile.address.number);
  
        setSelectedFoods(profile.types);
        if (profile.imageUrl) {
          setSelectedImage(profile.imageUrl);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
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
    setValue("types", newSelectedFoods, { shouldValidate: true });
  };

  const handleZipCodeChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value.replace(/\D/g, "");
    const maskedValue = maskZipcode(rawValue);
    setValue("address.zipcode", maskedValue, { shouldValidate: true });
    if (rawValue.length === 8) {
      const responseZipcode = await fetchAddressByZipcode(rawValue);
      if (responseZipcode) {
        setValue("address.street", responseZipcode.street || "");
        setValue("address.neighborhood", responseZipcode.neighborhood || "");
        setValue("address.city", responseZipcode.city || "");
        setValue("address.state", responseZipcode.state || "");
      }
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem não pode ser maior que 5MB");
      return;
    }
  
    try {
      setIsLoading(true);
      await updateRestaurantImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      toast.success("Imagem atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
      toast.error("Erro ao atualizar imagem");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        phone: data.phone.replace(/\D/g, ''),
        address: {
          ...data.address,
          zipcode: data.address.zipcode.replace(/\D/g, '')
        }
      }
      await updateRestaurantProfile(payload);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    ) {
      const password = prompt("Por favor, digite sua senha para confirmar:");
      if (password) {
        try {
          await deleteRestaurantAccount({ password });
          navigate("/login");
        } catch (error) {
          console.error("Error deleting account:", error);
        }
      }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  return (
    <div className="mx-auto p-30">
      <Toaster position="bottom-right" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-gray-300 flex flex-col items-center justify-center rounded-lg overflow-hidden relative">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Imagem do restaurante"
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
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={restaurantData?.email || ""}
                  className="w-full pl-10 h-[3rem]"
                  disabled
                />
              </div>

              <div className="relative w-full">
                <CreditCard
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="CNPJ"
                  value={restaurantData?.cnpj ? formatCNPJ(restaurantData.cnpj) : ""}
                  className="w-full pl-10 h-[3rem]"
                  disabled
                />
              </div>

              <button
                type="button"
                className="mt-4 w-full cursor-pointer font-roboto bg-primary text-white py-2 rounded-lg dark:bg-dark-primary"
                onClick={() => {
                  if (restaurantData?.email) {
                    navigate("/change-password", { 
                      state: { email: restaurantData.email } 
                    });
                  }
                }}
              >
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
                {errors.types && (
                  <span className="text-red-500">{errors.types.message}</span>
                )}

                {isOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-[180px] overflow-y-auto">
                    {types.map((option) => (
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
                  name="address.nickname"
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
                {errors.address?.nickname && (
                  <span className="text-red-500">
                    {errors.address.nickname.message}
                  </span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="address.zipcode"
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
                {errors.address?.zipcode && (
                  <span className="text-red-500">
                    {errors.address.zipcode.message}
                  </span>
                )}
              </div>

              <div className="relative col-span-2">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="address.street"
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
                {errors.address?.street && (
                  <span className="text-red-500">
                    {errors.address.street.message}
                  </span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="address.city"
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
                {errors.address?.city && (
                  <span className="text-red-500">
                    {errors.address.city.message}
                  </span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="address.neighborhood"
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
                {errors.address?.neighborhood && (
                  <span className="text-red-500">
                    {errors.address.neighborhood.message}
                  </span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="address.state"
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
                {errors.address?.state && (
                  <span className="text-red-500">
                    {errors.address.state.message}
                  </span>
                )}
              </div>

              <div className="relative">
                <House
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Controller
                  name="address.number"
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
                {errors.address?.number && (
                  <span className="text-red-500">
                    {errors.address.number.message}
                  </span>
                )}
              </div>
            </div>
            <button
                type="button"
                className="mt-8 w-full cursor-pointer font-roboto bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                onClick={handleDeleteAccount}
              >
                <Trash size={18} />
                Excluir conta
              </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-[11.5rem] cursor-pointer font-roboto bg-gray-300 text-gray-700 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isDirty}
            className={`w-[11.5rem] cursor-pointer font-roboto text-white py-2 rounded-lg ${
              isDirty ? "bg-primary dark:bg-dark-primary" : "bg-gray-400"
            }`}
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}