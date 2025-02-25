export function formatPrice(value: string) {
    return value
      .replace(/\D/g, "") 
      .replace(/^0+/, "") 
      .padStart(3, "0") 
      .replace(/(\d+)(\d{2})$/, "R$ $1,$2") 
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
  }
  