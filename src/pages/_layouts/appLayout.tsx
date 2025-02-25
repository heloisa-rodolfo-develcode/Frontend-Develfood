import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { CaretLeft, CurrencyDollar, ForkKnife, House, List, Phone, User } from "phosphor-react";

export function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`bg-primary text-white h-full flex flex-col items-center transition-all duration-300 ${
          isOpen ? "w-56" : "w-16"
        }`}
      >
        <button
          className={`text-white p-4 focus:outline-none cursor-pointer w-full ${
            isOpen ? "pl-6" : "flex justify-center"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <span className="flex gap-20 font-roboto">DEVELFOOD<CaretLeft size={24} /></span>
          ) : (
            <List size={24} />
          )}
        </button>

        <nav className="flex flex-col mt-4 space-y-4 w-full">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex space-x-4 p-3 transition-all duration-300 ${
                isActive && isOpen
                  ? "bg-white text-primary font-bold ml-4 rounded-l-lg"
                  : `hover:bg-gray-700 rounded-lg ${!isOpen ? "justify-center" : ""}`
              }`
            }
          >
            <House size={24} weight="fill" />
            {isOpen && <span>Home</span>}
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex space-x-4 p-3 transition-all duration-300 ${
                isActive && isOpen
                  ? "bg-white text-primary font-bold ml-4 rounded-l-lg"
                  : `hover:bg-gray-700 rounded-lg ${!isOpen ? "justify-center" : ""}`
              }`
            }
          >
            <User size={24} weight="fill" />
            {isOpen && <span>Perfil</span>}
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `flex space-x-4 p-3 transition-all duration-300 ${
                isActive && isOpen
                  ? "bg-white text-primary font-bold ml-4 rounded-l-lg"
                  : `hover:bg-gray-700 rounded-lg ${!isOpen ? "justify-center" : ""}`
              }`
            }
          >
            <ForkKnife size={24} weight="fill" />
            {isOpen && <span>Menu</span>}
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              `flex space-x-4 p-3 transition-all duration-300 ${
                isActive && isOpen
                  ? "bg-white text-primary font-bold ml-4 rounded-l-lg"
                  : `hover:bg-gray-700 rounded-lg ${!isOpen ? "justify-center" : ""}`
              }`
            }
          >
            <Phone size={24} weight="fill" />
            {isOpen && <span>Pedidos</span>}
          </NavLink>
          <NavLink
            to="/promotion"
            className={({ isActive }) =>
              `flex space-x-4 p-3 transition-all duration-300 ${
                isActive && isOpen
                  ? "bg-white text-primary font-bold ml-4 rounded-l-lg"
                  : `hover:bg-gray-700 rounded-lg ${!isOpen ? "justify-center" : ""}`
              }`
            }
          >
            <CurrencyDollar size={24} weight="fill" />
            {isOpen && <span>Promoções</span>}
          </NavLink>
        </nav>

        <div className="mt-auto bg-profile p-3 flex items-center space-x-4">
          <img src="images/profile/profile.jpg" alt="" className="w-10 h-10 rounded-full object-cover" />
          {isOpen && <span className="px-12">Heloisa</span>}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-primary text-white flex items-center justify-center p-4 shadow-md">
          <img src="/header-logo.svg" alt="DevelFood" className="h-8" />
        </header>
        <main className="p-4 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}