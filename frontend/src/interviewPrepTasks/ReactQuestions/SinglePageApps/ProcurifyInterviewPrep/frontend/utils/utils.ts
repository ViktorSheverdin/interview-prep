export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const sortBy = <T>(
  items: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc",
) => {
  return [...items].sort((a, b) => {
    const aField = a[field];
    const bField = b[field];
    if (aField < bField) return order === "asc" ? -1 : 1;
    if (aField > bField) return order === "asc" ? 1 : -1;
    return 0;
  });
};
