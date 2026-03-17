export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

export const formatDate = (value) => {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

export const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
} 

// module.export (
//     formatCurrency,
//     formatDate,
//     formatDateTime
// )