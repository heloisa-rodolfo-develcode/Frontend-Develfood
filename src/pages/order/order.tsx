import { useState, useEffect } from "react";
import { OrderCard } from "./components/orderCard";
import { Order } from "../../interfaces/orderInterface";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import toast, { Toaster } from "react-hot-toast";

export function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedOrderId, setDraggedOrderId] = useState<number | null>(null);
  const [targetStatus, setTargetStatus] = useState<string | null>(null);

  const statusColumns = ['Esperando Aceitação', 'Em Preparo', 'Em Rota', 'Entregue'];
  const statusOrder = ['Esperando Aceitação', 'Em Preparo', 'Em Rota', 'Entregue']; 

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersData = await getOrders();
      if (ordersData) {
        setOrders(ordersData);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleDragStart = (orderId: number) => {
    setDraggedOrderId(orderId);
  };

  const handleDragEnd = async (newStatus: string) => {
    if (draggedOrderId !== null) {
      const draggedOrder = orders.find((order) => order.id === draggedOrderId);
      if (draggedOrder) {
        const currentStatus = draggedOrder.status;
        const currentIndex = statusOrder.indexOf(currentStatus);
        const newIndex = statusOrder.indexOf(newStatus);
        if (newIndex > currentIndex) {
          setTargetStatus(newStatus);
          if (newStatus === 'Entregue') {
            setShowModal(true);
          } else {
            try {
              await updateOrderStatus(draggedOrderId, newStatus);
              const updatedOrders = orders.map((order) =>
                order.id === draggedOrderId ? { ...order, status: newStatus } : order
              );
              setOrders(updatedOrders);
            } catch (error) {
              console.error("Erro ao atualizar status do pedido:", error);
            }
          }
        } else {
          toast.error("Movimento inválido: só é permitido mover para a direita.");
        }
      }
    }
  };

  const confirmDelivery = async () => {
    if (draggedOrderId !== null && targetStatus !== null) {
      try {
        await updateOrderStatus(draggedOrderId, targetStatus);
        const updatedOrders = orders.map((order) =>
          order.id === draggedOrderId ? { ...order, status: targetStatus } : order
        );
        setOrders(updatedOrders);
      } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
      }
      setShowModal(false);
    }
  };

  const handleDoubleClick = async (orderId: number) => {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      const currentStatus = order.status;
      const nextStatus = getNextStatus(currentStatus);

      // Verifica se o próximo status está à direita do status atual
      const currentIndex = statusOrder.indexOf(currentStatus);
      const nextIndex = statusOrder.indexOf(nextStatus);

      if (nextIndex > currentIndex) {
        if (currentStatus === 'Em Rota' && nextStatus === 'Entregue') {
          setDraggedOrderId(orderId);
          setTargetStatus(nextStatus);
          setShowModal(true);
        } else {
          try {
            await updateOrderStatus(orderId, nextStatus);
            const updatedOrders = orders.map((order) =>
              order.id === orderId ? { ...order, status: nextStatus } : order
            );
            setOrders(updatedOrders);
          } catch (error) {
            console.error("Erro ao atualizar status do pedido:", error);
          }
        }
      } else {
        console.log("Movimento inválido: só é permitido mover para a direita.");
      }
    }
  };

  const getNextStatus = (currentStatus: string): string => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : currentStatus;
  };

  return (
    <div className="flex h-screen">
      <Toaster position="bottom-right"/>
      <div className="flex-1 bg-gray-100 p-6 dark:bg-dark-background">
        <h1 className="text-center text-3xl font-roboto font-bold">Seus pedidos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {statusColumns.map((status, index) => (
            <div
              key={status}
              className="flex flex-col gap-4 relative"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDragEnd(status)}
            >
              {index > 0 && <div className="absolute left-[-1rem] top-0 bottom-0 w-px bg-gray-300"></div>}
              <h2 className="text-lg font-semibold">{status}</h2>
              {orders
                .filter((order) => order.status === status)
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    id={order.id}
                    orderName={order.orderName}
                    date={order.date}
                    payment={order.payment}
                    status={order.status}
                    comment={order.comment}
                    onExpand={() => toggleExpand(order.id)}
                    isExpanded={expandedOrderId === order.id}
                    onDragStart={() => handleDragStart(order.id)}
                    onDoubleClick={() => handleDoubleClick(order.id)}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold">Confirmar Entrega</h2>
            <p>Deseja marcar este pedido como entregue?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded"
                onClick={confirmDelivery}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}