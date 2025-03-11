import { useState } from "react";
import { PencilSimple, Trash } from "phosphor-react";
import { NavLink } from "react-router-dom";
import { Promotion } from "../../interfaces/promotionInterface";




interface CardPromotionsProps {
  promotions: Promotion;
  onDelete: (action: string) => void;
}

export function CardPromotions({ promotions, onDelete }: CardPromotionsProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-[16rem] bg-white shadow-lg rounded-lg p-3 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={promotions.image ?? "/placeholder.png"}
        alt={promotions.name}
        className="w-full h-40 object-cover rounded-lg"
      />

      <div
        className={`absolute top-20 left-3 flex flex-col gap-2 transition-all duration-300 ease-in-out ${
          hovered ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
        }`}
      >
        <NavLink to={`/promotion-edit/${promotions.id}`}>
          <button className="bg-white text-green-600 p-4 rounded-full shadow-md hover:bg-green-50 transition-colors">
            <PencilSimple size={16} />
          </button>
        </NavLink>
        <button
          className="bg-white text-red-600 p-4 rounded-full shadow-md hover:bg-red-50 transition-colors"
          onClick={() => onDelete("excluir")}
        >
          <Trash size={16} />
        </button>
      </div>

      <p className="text-center mt-2 font-medium">{promotions.name}</p>
    </div>
  );
}