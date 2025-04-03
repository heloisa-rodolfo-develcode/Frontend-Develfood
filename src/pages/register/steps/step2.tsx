import { useState, useEffect, useRef } from "react";
import { User, Phone, ForkKnife, CaretDown } from "phosphor-react";
import { Input } from "../../../components/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatPhone } from "../../../utils/masks/maskPhone";
import { useFormContext } from "../context/formContext";
import { CreateRestaurantRequest } from "../../../interfaces/restaurantInterface";

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
});

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

type SchemaStep2 = z.infer<typeof schema>;

export default function Step2({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<SchemaStep2>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      phone: "",
      types: [],
    },
  });

  const { setFormData } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const onSubmit = (data: Partial<CreateRestaurantRequest>) => {
    setFormData((prev: CreateRestaurantRequest) => ({
      ...prev,
      ...data,
      types: data.types || [],
    }));
    onNext();
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
    <div className="flex flex-col justify-center items-center bg-background gap-10">
      <img
        src="images/step/step2.svg"
        alt="step 2"
        className="w-[10rem] h-auto object-cover"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 mb-6">
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Nome"
                  className="w-[24rem] h-[3rem]"
                />
              )}
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="relative mt-2">
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
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
                  className="w-[24rem] h-[3rem]"
                  value={formatPhone(field.value || "")}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                />
              )}
            />
            {errors.phone && (
              <span className="text-red-500">{errors.phone.message}</span>
            )}
          </div>

          <div className="relative mt-2" ref={dropdownRef}>
            <div
              className="relative flex items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <ForkKnife className="absolute left-3 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Tipos de comida"
                className="w-[24rem] h-[3rem] cursor-pointer"
                readOnly
                value={selectedFoods.length > 0 ? selectedFoods.join(", ") : ""}
              />
              <CaretDown className="absolute right-3 text-gray-400" size={18} />
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
        <div className="flex gap-4">
          <button
            type="button"
            className="w-full mt-6 bg-primary text-white font-roboto py-2 px-18 rounded-lg cursor-pointer"
            onClick={onBack}
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
