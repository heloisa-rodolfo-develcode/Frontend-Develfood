import { useState } from "react";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import { FormProvider } from "./context/formContext";
import { CreateRestaurantRequest } from "../../services/createRestaurant";

export function SignUp() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinalSubmit = async (data: CreateRestaurantRequest) => {
    console.log("Dados finais:", data);
  };

  return (
    <FormProvider>
      <div className="flex min-h-screen w-full items-start justify-center bg-background md:items-center">
        <div className="flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-[30rem] h-auto object-cover mb-10"
          />
          <div className="mt-0 w-72 md:w-96 xl:w-[558px]">
            {step === 1 && <Step1 onNext={nextStep} />}
            {step === 2 && <Step2 onNext={nextStep} onBack={prevStep} />}
            {step === 3 && <Step3 onSubmit={handleFinalSubmit} onBack={prevStep} />}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
