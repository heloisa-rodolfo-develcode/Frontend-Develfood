import { Envelope, Eye, EyeSlash, Lock } from "phosphor-react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { Toaster } from "react-hot-toast";
import { Input } from "../../components/input";

import Button from "../../components/button";
import { cn } from "../../utils/utils";
import { authenticate } from "../../services/authService";

const signinForm = z.object({
  email: z.string().email({ message: "Insira um e-mail válido" }),
  password: z
    .string()
    .min(8, { message: "A senha precisa ter no mínimo 8 caracteres" }),
});

type SignInForm = z.infer<typeof signinForm>;

export function SignIn() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signinForm),
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: SignInForm) => {
    const response = await authenticate(data);

    if (response && response.token) {
      localStorage.setItem("authToken", response.token);

      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } else {
      console.log("Usuário ou senha incorretos!");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Toaster position="bottom-right" />

      <div className="w-3/5 h-screen">
        <img
          src="/images/loginImage.svg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-2/5 flex flex-col items-center justify-center mx-auto">
        <div className="w-[32rem] h-[42rem] flex flex-col items-center justify-center shadow-[4px_4px_20px_0px_rgba(0,0,0,0.2)] rounded-lg px-12 py-16">
          <img src="/logo.svg" alt="Logo" className="mb-8" />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-[300px]"
          >
            <div className="relative flex flex-col  w-full mt-4">
              <Envelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                {...register("email")}
                type="email"
                placeholder="E-mail"
                className={cn(errors.email ? "border-red-500" : "")}
                required
              />
              {errors.email && (
                <span className="h-1 text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="relative flex flex-col justify-center w-full mt-4">
              <Lock className="absolute left-3 text-gray-400 pointer-events-none" />
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className={cn("pl-10", errors.password ? "border-red-500" : "")}
                required
              />
              {errors.password && (
                <span className="h-1 text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Carregando..." : "Logar"}
            </Button>
          </form>

          <div className="flex flex-col items-center justify-center mt-4 text-sm text-primary">
            <a href="#" className="block hover:underline">
              Esqueci minha senha
            </a>
            <a
              href="#"
              className="block hover:underline mt-0.5"
              onClick={(e) => {
                e.preventDefault();
                navigate("/sign-up");
              }}
            >
              Criar conta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}