import { useNavigate } from "react-router-dom";
import Button from "../../components/button";


export function SuccessPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/sign-in")
  }

  return (
    <div className="flex w-full items-start justify-center bg-background md:items-center">
      <div className="flex flex-col items-center mt-10">
  
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <img
            src="/images/successRegister.svg"
            alt="success"
            className="w-[10rem] h-auto object-cover mb-16"
          />
          <p>Cadastro finalizado!</p>
          <p>
            Parabéns! Agora você pode aproveitar nossas ofertas e serviços e
            economizar com super cupons Develfood.
          </p>
        </div>
        <Button className="h-[4rem] w-[2rem] font-roboto text-2xl" onClick={handleContinue}>
            Continuar
        </Button>
      </div>
    </div>
  );
}
