import { Calendar, CaretDown, CaretUp, Chat, CreditCard, CurrencyDollar, ForkKnife } from "phosphor-react";
import { Order } from "../../../interfaces/orderInterface";


interface OrderCardProps extends Order {
  onExpand: () => void;
  isExpanded: boolean;
  onDragStart: () => void;
  onDoubleClick: () => void;
}

export const OrderCard = ({
  orderName,
  date,
  payment,
  comment,
  onExpand,
  isExpanded,
  onDragStart,
  onDoubleClick,
}: OrderCardProps) => {
  return (
    <div
      className="bg-primary text-white p-4 w-[18rem] rounded-lg mt-2 cursor-pointer"
      draggable
      onDragStart={onDragStart}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2">
          <ForkKnife size={16} weight="fill" /> {orderName}
        </span>
      </div>
      <div className="flex justify-between items-center mt-1" onClick={onExpand}>
        <span className="flex items-center gap-2">
          <Chat size={16} weight="fill" /> {comment} {/* Exibe o comentário */}
        </span>
        <span>{isExpanded ? <CaretUp size={16} weight="fill" /> : <CaretDown size={16} weight="fill" />}</span>
      </div>
      {isExpanded && (
        <>
          <hr className="my-2 border-gray-300" />
          <div className="mt-2">
            <p className="flex items-center gap-2">
              <Calendar size={16} weight="fill" /> {date}
            </p>
            <p className="flex items-center gap-2">
              <CreditCard size={16} weight="fill" /> {payment}
            </p>
            <p className="flex items-center gap-2">
              <CurrencyDollar size={16} weight="fill" /> R$ 50,00
            </p>
          </div>
        </>
      )}
    </div>
  );
};