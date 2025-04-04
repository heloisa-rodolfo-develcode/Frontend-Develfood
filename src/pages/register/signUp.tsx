import { useState } from "react";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import { FormProvider } from "./context/formContext";
import { SuccessPage } from "./successPage";
import { ErrorPage } from "./errorPage";
import { createRestaurant } from "../../services/createRestaurant";
import { CreateRestaurantRequest } from "../../interfaces/restaurantInterface";

export function SignUp() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (data: CreateRestaurantRequest) => {
    try {
      const payload = {
        cnpj: data.cnpj.replace(/\D/g, ''), 
        name: data.name,
        phone: data.phone.replace(/\D/g, ''), 
        email: data.email,
        password: data.password,
        types: data.types,
        address: {
          nickname: data.address.nickname,
          zipcode: data.address.zipcode.replace(/\D/g, ''), 
          street: data.address.street,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state,
          number: data.address.number
        }
      };
  
      const response = await createRestaurant(payload);
      
      if (response.status === 201) {
        setIsSuccess(true);
      } else {
        throw new Error
      }
    } catch{
      setIsError(true);

    }
  };


  const handleRetry = () => {
    setIsError(false); 
    setStep(1); 
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
            {isSuccess && <SuccessPage />}
            {isError && <ErrorPage onRetry={handleRetry} />}
            {!isSuccess && !isError && (
              <>
                {step === 1 && <Step1 onNext={nextStep} />}
                {step === 2 && <Step2 onNext={nextStep} onBack={prevStep} />}
                {step === 3 && <Step3 onSubmit={handleSubmit} onBack={prevStep} />}
              </>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}