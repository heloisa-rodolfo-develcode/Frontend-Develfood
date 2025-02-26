import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ForkKnife, CaretDown, Image } from "phosphor-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { formatPrice } from "../../utils/masks/maskPrice";
import toast, { Toaster } from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  price: z.string().min(1, "O preço é obrigatório"),
  foodTypes: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo de comida")
    .max(1, "Selecione no máximo um tipo de comida"),
});

type DishFormData = z.infer<typeof schema>;

const foodTypes = [
  { label: "Pratos", value: "pratos" },
  { label: "Sobremesas", value: "sobremesas" },
  { label: "Bebidas", value: "bebidas" },
];

export function DishEdit() {
  const { id } = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<DishFormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      price: "",
      foodTypes: [],
    },
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/products/${id}`)
        .then((response) => {
          const product = response.data;
          setValue("name", product.name);
          setValue("description", product.description);
          setValue("price", product.price);
          setValue("foodTypes", product.foodTypes);
          setSelectedFoods(product.foodTypes);
          setSelectedImage(product.image);
        })
        .catch((error) => console.error("Erro ao carregar produto:", error));
    }
  }, [id, setValue]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (value: string) => {
    const newSelectedFoods = selectedFoods.includes(value) ? [] : [value];

    setSelectedFoods(newSelectedFoods);
    setValue("foodTypes", newSelectedFoods, { shouldValidate: true });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: DishFormData) => {
    const token = localStorage.getItem("token");

    axios
      .put(`http://localhost:3000/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Produto atualizado com sucesso:", response.data);

        toast.success("Produto atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar produto:", error);

        toast.error("Erro ao atualizar o produto. Tente novamente.");
      });
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
    <div className="flex items-center justify-center p-6 mt-8 bg-gray-100">
      <div className="relative max-w-2xl p-6">
        <Toaster position="bottom-right" />
        <NavLink to="/menu">
          <button className="absolute top-5 p-2 w-[4rem] bg-primary text-white rounded-lg cursor-pointer mr-10">
            <ArrowLeft size={20} weight="fill" className="ml-3" />
          </button>
        </NavLink>

        <h2 className="text-3xl font-bold font-roboto text-center mb-18">
          Edite seu prato
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-6">
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

            <div className="flex-1 space-y-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Nome"
                    className="w-[20rem]  p-2 border rounded"
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
                    className="w-[20rem]  p-2 border rounded h-24"
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
                    className="w-[20rem] p-2 border rounded"
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
                    className="w-[20rem]  p-2 border rounded cursor-pointer pl-10"
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
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
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
              className="w-[20rem] mt-6 ml-16 p-3 bg-primary text-white text-xl rounded font-roboto font-bold cursor-pointer disabled:bg-gray-400"
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
