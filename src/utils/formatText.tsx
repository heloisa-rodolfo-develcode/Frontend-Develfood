
export const formatTextWithBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    
    const pedidoParts = part.split(/(Pedido\s+\d+)/g);
    return pedidoParts.map((pedidoPart, pedidoIndex) => {
      if (/Pedido\s+\d+/.test(pedidoPart)) {
        return <strong key={`${index}-${pedidoIndex}`}>{pedidoPart}</strong>;
      }
      return pedidoPart;
    });
  });
};