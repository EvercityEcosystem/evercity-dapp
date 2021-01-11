export const toEverUSD = (amount) => (amount || 0) * 10 ** 9;

export const fromEverUSD = (amount) => (amount || 0) / 10 ** 9;

export const toPercent = (amount) => (amount || 0) / 10 ** 3;

export const fromBondDays = (value) => value / 60;

export const toBondDays = (value) => value * 60;