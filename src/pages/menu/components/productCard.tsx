import { useState } from "react";
import { PencilSimple, Trash } from "phosphor-react";
import { NavLink } from "react-router-dom";
import { Product } from "../../../interfaces/productInterface";

interface CardProductProps {
  products: Product;
  onDelete: (action: string) => void;
}

export function CardProduct({ products, onDelete }: CardProductProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative w-[16rem] shadow-lg rounded-lg p-3 overflow-hidden transition-colors ${
        products.available ? "bg-white dark:bg-dark-background" : "bg-gray-100 dark:bg-dark-background"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <img
          src={products.foodImage ?? "/placeholder.png"}
          alt={products.name}
          className="w-full h-40 object-cover rounded-lg"
        />

        {!products.available && (
          <div className="absolute inset-0 bg-gray-400 opacity-60 rounded-lg"></div>
        )}
      </div>

      <div
        className={`absolute top-20 left-3 flex flex-col gap-2 transition-all duration-300 ease-in-out ${
          hovered ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
        }`}
      >
        <NavLink to={`/dish-edit/${products.id}`}>
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

      <div className="flex items-center justify-center mt-2">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${
            products.available ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <p className="text-center font-medium">{products.name}</p>
      </div>
    </div>
  );
}