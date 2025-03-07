import { useState, useEffect } from "react";
import { MagnifyingGlass, CaretLeft, CaretRight } from "phosphor-react";
import { NavLink } from "react-router-dom";

import axios from "axios";
import { CardProduto } from "../../components/productCard";

interface Produto {
  id: number;
  name: string; 
  image: string;
 
}

export function Menu() {
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    axios
      .get("https://backend-develfood-server.vercel.app/products")
      .then((response) => {
        console.log("Resposta da API:", response.data);
        if (Array.isArray(response.data)) {
          setProdutos(response.data); 
        } else {
          console.error("Resposta inesperada da API:", response.data);
        }
      })
      .catch((error) => console.error("Erro ao carregar produtos:", error));
  }, []);

  const filteredProdutos = searchTerm.length >= 3
    ? produtos.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : produtos;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProdutos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProdutos.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleOpenModal = (action: string, productId: number) => {
    setModalAction(action);
    setProductToDelete(productId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (productToDelete === null) return;

    try {
      await axios.delete(`https://backend-develfood-server.vercel.app/products/${productToDelete}`);
      setProdutos(produtos.filter((product) => product.id !== productToDelete)); 
      setShowModal(false); 
      setProductToDelete(null); 
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-center gap-30 items-center">
        <NavLink to="/dish-register">
          <button className="bg-primary font-roboto text-white text-xl px-5 py-2 rounded-lg cursor-pointer">
            Novo prato +
          </button>
        </NavLink>
        <h1 className="text-4xl font-semibold font-roboto text-center mb-6">
          Menu do restaurante
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Nome do prato"
            className="border bg-white border-gray-300 rounded-lg px-8 py-2"
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
        {currentItems.map((product) => (
          <CardProduto
            key={product.id}
            products={product}
            onDelete={() => handleOpenModal("excluir", product.id)} 
          />
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <CaretLeft />
        </button>
        <span className="text-lg font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          <CaretRight />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-20 rounded-lg shadow-lg text-center">
            <p className="text-xl font-roboto font-semibold mb-10">
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