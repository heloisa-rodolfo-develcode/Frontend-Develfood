export function maskZipcode(value: string): string {
    return value
      .replace(/\D/g, '') 
      .replace(/^(\d{5})(\d{3})$/, '$1-$2'); 
  }