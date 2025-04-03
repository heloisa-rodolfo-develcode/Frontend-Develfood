import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ForkKnife, CaretDown, Image } from "phosphor-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { formatPrice } from "../../utils/masks/maskPrice";
import { Toaster } from "react-hot-toast";
import { getProductById, updateProduct } from "../../services/productService";
import { useRestaurantProfile } from "../../context/restaurantProfileContext";

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  price: z.string().min(1, "O preço é obrigatório"),
  foodTypes: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo de comida")
    .max(1, "Selecione no máximo um tipo de comida"),
  available: z.boolean(),
});

type DishFormData = z.infer<typeof schema>;

const foodTypes = [
  { label: "Prato", value: "FOOD" },
  { label: "Sobremesa", value: "DESSERT" },
  { label: "Drink", value: "DRINK" },
];

export function DishEdit() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useRestaurantProfile(); 
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<DishFormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (id && profile?.id) { 
      getProductById(profile.id, id)
        .then((product) => {
          reset({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            foodTypes: Array.isArray(product.foodCategory) 
              ? product.foodCategory 
              : [product.foodCategory], 
            available: product.available, 
          });
          setSelectedFoods(
            Array.isArray(product.foodCategory) 
              ? product.foodCategory 
              : [product.foodCategory] 
          );
          setSelectedImage(product.foodImage);
        })
        .catch((error) => console.error("Erro ao carregar produto:", error));
    }
  }, [id, reset, profile?.id]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (value: string) => {
    const newSelectedFoods = selectedFoods.includes(value) ? [] : [value];

    setSelectedFoods(newSelectedFoods);
    setValue("foodTypes", newSelectedFoods, { shouldValidate: true });
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

  const onSubmit = async (data: DishFormData) => {
    if (id) {
      try {
        const priceAsString = data.price
          .replace('R$', '')
          .replace(/\./g, '')
          .replace(',', '.')
          .trim();
  
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = fileInput.files?.[0]; 

        const dishData = {
          name: data.name,
          description: data.description,
          price: priceAsString, 
          foodTypes: data.foodTypes,
          available: data.available,
        };
  
        await updateProduct(id, dishData, file); 
  
        setTimeout(() => navigate("/menu"), 2000);
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-6 mt-8 bg-gray-100 dark:bg-dark-background">
      <div className="relative max-w-2xl p-6">
        <Toaster position="bottom-right" />
        <NavLink to="/menu">
          <button className="absolute top-5 p-2 w-[4rem] bg-primary text-white rounded-lg cursor-pointer mr-10 dark:bg-dark-primary">
            <ArrowLeft size={20} weight="fill" className="ml-3" />
          </button>
        </NavLink>

        <h2 className="text-3xl font-bold font-roboto text-center mb-18">
          Edite seu prato
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-6">
            <div className="">
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

              <Controller
                name="available"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg  ${
                        field.value
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                      onClick={() => field.onChange(true)} 
                    >
                      Ativo
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg ${
                        !field.value
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                      onClick={() => field.onChange(false)} 
                    >
                      Inativo
                    </button>
                  </div>
                )}
              />
            </div>

            <div className="flex-1 space-y-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Nome"
                    className="w-[20rem] p-2 border rounded dark:bg-white text-gray-600"
                  />
                )}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Descrição"
                    className="w-[20rem] p-2 border rounded h-24 dark:bg-white text-gray-600"
                  />
                )}
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}

              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Preço"
                    className="w-[20rem] p-2 border rounded dark:bg-white text-gray-600"
                    onChange={(e) =>
                      field.onChange(formatPrice(e.target.value))
                    }
                  />
                )}
              />
              {errors.price && (
                <span className="text-red-500">{errors.price.message}</span>
              )}

              <div className="relative" ref={dropdownRef}>
                <div
                  className="relative flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <ForkKnife
                    className="absolute left-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Tipos de comida"
                    className="w-[20rem]  p-2 border rounded cursor-pointer pl-10 dark:bg-white text-gray-600"
                    readOnly
                    value={
                      selectedFoods.length > 0 ? selectedFoods.join(", ") : ""
                    }
                  />
                  <CaretDown
                    className="absolute right-33 text-gray-400"
                    size={18}
                  />
                </div>
                {errors.foodTypes && (
                  <span className="text-red-500">
                    {errors.foodTypes.message}
                  </span>
                )}

                {isOpen && (
                  <div className="absolute mt-1 w-[20rem] bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-30 overflow-y-auto">
                    {foodTypes.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer dark:bg-white text-gray-600"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFoods.includes(option.value)}
                          onChange={() => handleCheckboxChange(option.value)}
                          className="mr-2"
                          disabled={
                            selectedFoods.length >= 1 &&
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

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[20rem] mt-6 ml-16 p-3 bg-primary text-white text-xl rounded font-roboto font-bold cursor-pointer dark:bg-dark-primary disabled:bg-gray-400"
              disabled={!isValid}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}