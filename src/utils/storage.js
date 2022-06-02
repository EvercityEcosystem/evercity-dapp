import { LIST_VIEW_DEFAULT_MODE } from "./env";

export const saveCurrentUser = (address, role) => {
  if (!address || !role) {
    return;
  }

  localStorage.setItem("userAddress", address);
  localStorage.setItem("userRole", role);
};

export const forgetCurrentUser = () => {
  localStorage.removeItem("userAddress");
  localStorage.removeItem("userRole");
};

export const getCurrentUser = () => ({
  address: localStorage.getItem("userAddress"),
  role: localStorage.getItem("userRole"),
});

export const getViewParams = () => ({
  listView: localStorage.getItem("listView") || LIST_VIEW_DEFAULT_MODE,
});

export const setViewParams = params => {
  const { listView } = params;

  localStorage.setItem("listView", listView);
};

export const getCurrentUserAddress = () => localStorage.getItem("userAddress");
