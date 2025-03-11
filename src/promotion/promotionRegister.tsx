import { useState } from "react";
import { ArrowLeft, Image, Calendar } from "phosphor-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { promotionRegister } from "../services/promotionService";

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  percentage: z.string().min(1, "O percentual é obrigatório"),
  start: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Data de início inválida",
  }),
  end: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Data final inválida",
  }),
  image: z.string().optional(),
}).refine((data) => {
  return data.start && data.end;
}, {
  message: "As datas de início e fim são obrigatórias",
  path: ["end"],
});

type PromotionFormData = z.infer<typeof schema>;

export function PromotionRegister() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      percentage: "",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    },
  });

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

  const onSubmit = async (data: PromotionFormData) => {
    try {
      await promotionRegister({
        name: data.name,
        image: selectedImage || null,
        percentage: data.percentage,
        start: data.start,
        end: data.end,
      });

      setTimeout(() => {
        navigate("/promotion");
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar promoção:", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-6 mt-8 bg-gray-100">
      <div className="relative max-w-2xl p-6">
        <Toaster position="bottom-right" />
        <NavLink to="/promotion">
          <button className="absolute top-5 p-2 w-[4rem] bg-primary text-white rounded-lg cursor-pointer mr-10">
            <ArrowLeft size={20} weight="fill" className="ml-3" />
          </button>
        </NavLink>

        <h2 className="text-3xl font-bold font-roboto text-center mb-18">
          Cadastro de novas promoções
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
                    className="w-[20rem] p-2 border rounded"
                  />
                )}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}

              <Controller
                name="percentage"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Percentual"
                    className="w-[20rem] p-2 border rounded"
                  />
                )}
              />
              {errors.percentage && (
                <span className="text-red-500">{errors.percentage.message}</span>
              )}

              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => {
                      setStartDate(date);
                      if (date) {
                        setValue("start", date.toISOString(), { shouldValidate: true });
                        if (endDate && date > endDate) {
                          setEndDate(null);
                          setValue("end", "", { shouldValidate: true });
                        }
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="w-[20rem] p-2 border rounded pl-10"
                    minDate={new Date()}
                    placeholderText="Início"
                  />
                  <Calendar
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                </div>
                {errors.start && (
                  <span className="text-red-500">{errors.start.message}</span>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => {
                      setEndDate(date);
                      if (date) {
                        setValue("end", date.toISOString(), { shouldValidate: true });
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="w-[20rem] p-2 border rounded pl-10"
                    minDate={startDate || new Date()}
                    placeholderText="Final"
                  />
                  <Calendar
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                </div>
                {errors.end && (
                  <span className="text-red-500">{errors.end.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[20rem] mt-6 p-3 bg-primary text-white text-xl rounded font-roboto font-bold cursor-pointer disabled:bg-gray-400"
              disabled={!isValid || !startDate || !endDate}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}