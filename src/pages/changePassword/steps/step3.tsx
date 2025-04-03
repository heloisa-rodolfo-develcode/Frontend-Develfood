import { CheckCircle } from "phosphor-react";

interface Step3Props {
  onBack: () => void;
}

export function Step3({ onBack }: Step3Props) {
  return (
    <div className="text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2 dark:text-white">Senha redefinida com sucesso!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
      </p>
      <button
        className="w-full bg-primary text-white cursor-pointer py-2 rounded-lg hover:bg-primary-dark transition-colors dark:bg-dark-primary"
        onClick={onBack}
      >
        Voltar para o login
      </button>
    </div>
  );
}