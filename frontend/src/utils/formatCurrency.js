export const formatCurrency = (value) => {
  if (isNaN(value)) {
    return "R$ 0,00"; // Retorna um valor padrão caso o valor não seja numérico
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
