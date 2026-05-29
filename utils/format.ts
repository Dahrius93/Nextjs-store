export const formatCurrency = (amount: number | null) => {
  const value = amount || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    day: "numeric",
    month: "long",
  }).format(date);
};

// per italia
// export const formatDate = (date: Date) => {
//   return new Intl.DateTimeFormat("it-IT", {
//   day: "numeric",
//   month: "long",
//   year: "numeric",
//   }).format(date);
// };
