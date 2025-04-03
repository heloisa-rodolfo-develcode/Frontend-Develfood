import { useState } from "react";
import { Lock, Eye } from "phosphor-react";
import { EyeOff } from "lucide-react";
import { Input } from "../../../components/input";
import { z } from "zod";

const validationSchema = z
  .object({
    code: z
      .array(
        z.string().length(1, "Cada dígito deve ter exatamente 1 caractere.")
      )
      .length(6, "O código deve ter exatamente 6 dígitos."),
    newPassword: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(
        /[!@#$%^&*(),.?":{}/<>]/,
        "A senha deve conter pelo menos um caractere especial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem!",
    path: ["confirmPassword"],
  });

interface Step2Props {
  email: string;
  onNextStep: () => void;
  onBack: () => void;
}

export function Step2({ email, onNextStep, onBack }: Step2Props) {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCodeChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault(); 

    const validationResult = validationSchema.safeParse({
      code,
      newPassword,
      confirmPassword,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setErrors(errors);
      return;
    }

    setErrors({});
    onNextStep();
  };

  return (
    <form onSubmit={handleFinish}> 
      <p className="text-gray-700 dark:text-white mb-2 text-center">
        Por favor, digite o código que enviamos agora para:
      </p>
      <p className="font-bold mb-4 text-center dark:text-white">{email}</p>

      <div className="flex justify-center gap-2 mb-6">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-black dark:bg-white"
          />
        ))}
      </div>
      {errors.code && (
        <p className="text-red-500 text-sm mb-4 text-center">{errors.code}</p>
      )}

      <div className="relative mb-4">
        <Lock
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full pl-10 h-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-black dark:bg-white"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.newPassword && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {errors.newPassword}
        </p>
      )}

      <div className="relative mb-6">
        <Lock
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full pl-10 h-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-black dark:bg-white"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {errors.confirmPassword}
        </p>
      )}

      <div className="flex flex-row mt-6">
        <button
          type="button" 
          className="w-full bg-primary text-white cursor-pointer py-2 rounded-lg hover:bg-primary-dark transition-colors mr-2 dark:bg-dark-primary"
          onClick={onBack}
        >
          Voltar
        </button>
        <button
          type="submit" 
          className="w-full bg-primary text-white cursor-pointer py-2 rounded-lg hover:bg-primary-dark transition-colors ml-2 dark:bg-dark-primary"
        >
          Concluir
        </button>
      </div>
    </form>
  );
}