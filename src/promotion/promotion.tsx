import { useState, useEffect } from "react";
import { MagnifyingGlass, CaretLeft, CaretRight } from "phosphor-react";
import { NavLink } from "react-router-dom";
import { CardPromotions } from "./components/promotionCard";
import { Promotion } from "../interfaces/promotionInterface";
import { deletePromotion, getPromotion } from "../services/promotionService";


export function PromotionPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [promotions, setPromotion] = useState<Promotion[]>([]);
  const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;


  useEffect(() => {
    const loadPromotion = async () => {
      try {
        const promotions = await getPromotion();
        setPromotion(promotions);
      } catch (error) {
        console.error("Erro ao carregar promoções:", error);
      }
    };

    loadPromotion();
  }, []);

  const filteredPromotions = searchTerm.length >= 3
    ? promotions.filter((promotion) =>
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : promotions;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPromotions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleOpenModal = (action: string, promotionId: number) => {
    setModalAction(action);
    setPromotionToDelete(promotionId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (promotionToDelete === null) return;

    try {
      await deletePromotion(promotionToDelete);
      setPromotion(promotions.filter((promotion) => promotion.id !== promotionToDelete)); 
      setShowModal(false); 
      setPromotionToDelete(null); 
    } catch (error) {
      console.error("Erro ao excluir promoção:", error);
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-center gap-30 items-center">
        <NavLink to="/promotion-register">
          <button className="bg-primary font-roboto text-white text-xl px-5 py-2 rounded-lg cursor-pointer dark:bg-dark-primary">
            Nova promoção +
          </button>
        </NavLink>
        <h1 className="text-4xl font-semibold font-roboto text-center mb-6">
          Suas promoções
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Nome da promoção"
            className="border bg-white border-gray-300 rounded-lg px-8 py-2 dark:text-dark-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlass
            size={16}
            className="absolute right-3 top-3 text-gray-500"
          />
        </div>
      </div>
      <div className="mr-20 ml-20 grid grid-cols-4 gap-4 mt-4">
        {currentItems.map((promotion) => (
          <CardPromotions
            key={promotion.id}
            promotions={promotion}
            onDelete={() => handleOpenModal("excluir", promotion.id)} 
          />
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          className="bg-primary text-white px-4 py-2 rounded dark:bg-dark-primary disabled:opacity-50"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <CaretLeft />
        </button>
        <span className="text-lg font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="bg-primary text-white px-4 py-2 rounded dark:bg-dark-primary disabled:opacity-50"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          <CaretRight />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-20 rounded-lg shadow-lg text-center">
            <p className="text-xl font-roboto font-semibold mb-10 dark:text-black">
              Você tem certeza que deseja {modalAction} este item?
            </p>
            <div className="flex justify-center gap-12">
              <button
                className="bg-green-500 text-white px-12 py-4 rounded-lg cursor-pointer hover:bg-green-600 transition-colors"
                onClick={handleDelete}
              >
                Sim
              </button>
              <button
                className="bg-red-500 text-white px-12 py-4 rounded-lg cursor-pointer hover:bg-red-600 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}