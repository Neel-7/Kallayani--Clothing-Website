export const adminMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const adminDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
