import { Envelope } from "phosphor-react";
import { Input } from "../../../components/input";
import { z } from "zod";
import { useState } from "react";

const emailSchema = z.string().email("Por favor, insira um e-mail válido.");

interface Step1Props {
  email: string;
  setEmail: (email: string) => void;
  onNextStep: () => void;
  onBack: () => void;
  isEmailDisabled: boolean;
}

export function Step1({ email, setEmail, onNextStep, onBack, isEmailDisabled }: Step1Props) {
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    try {
      emailSchema.parse(email);
      setEmailError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!validateEmail()) return;
    onNextStep();
  };

  return (
    <form onSubmit={handleContinue}>
      <div className="space-y-4">
        <div className="relative">
          <Envelope
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className="w-full pl-10 h-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-400"
            disabled={isEmailDisabled}
          />
        </div>
        {emailError && (
          <p className="text-red-500 text-sm mt-2">{emailError}</p>
        )}
      </div>

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
          Continuar
        </button>
      </div>
    </form>
  );
}