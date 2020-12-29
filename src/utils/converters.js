export const toEverUSD = (amount) => {
  return (amount || 0) / 10 ** 9;
};

export const toPercent = (amount) => {
  return (amount || 0) / 10 ** 3;
};
