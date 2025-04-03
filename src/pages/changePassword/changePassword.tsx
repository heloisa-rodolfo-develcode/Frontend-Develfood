import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Step1 } from "./steps/step1";
import { Step2 } from "./steps/step2";
import { Step3 } from "./steps/step3";


export function ChangePassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    if (step === 1) {
      const from = location.state?.from || "/sign-in";
      navigate(from);
    } else {
      setStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-dark-background">
      <img src="logo.svg" alt="Logo" className="mb-10" />

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md dark:bg-dark-background">
        {step === 1 && (
          <Step1
            email={email}
            setEmail={setEmail}
            onNextStep={handleNextStep}
            onBack={handlePreviousStep}
            isEmailDisabled={!!location.state?.email}
          />
        )}

        {step === 2 && (
          <Step2
            email={email}
            onNextStep={handleNextStep}
            onBack={handlePreviousStep}
          />
        )}

        {step === 3 && (
          <Step3 onBack={() => navigate("/sign-in")} />
        )}
      </div>
    </div>
  );
}