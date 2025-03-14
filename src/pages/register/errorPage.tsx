import { useNavigate } from "react-router-dom";
import Button from "../../components/button";



export function ErrorPage(){

  const navigate = useNavigate()
  const handleSignUp = () => navigate('/sign-up')

  return (
    <div className="flex w-full items-start justify-center bg-background md:items-center">
      <div className="flex flex-col items-center mt-10">
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <img
            src="/images/errorRegister.svg"
            alt="success"
            className="w-[10rem] h-auto object-cover mb-16"
          />
          <p>Algo deu errado!</p>
          <p>
            Um erro ocorreu, contate o administrador do site ou tente novamente
          </p>
        </div>
        <Button onClick={handleSignUp} className="h-[4rem] w-[2rem] font-roboto text-2xl">
          Continuar
        </Button>
      </div>
    </div>
  );
}