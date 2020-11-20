import Cookies from 'js-cookie';

export const saveCurrentUser = (address, role) => {
  if (!address || !role) {
    return;
  }

  Cookies.set('address', address, { path: '/' });
  Cookies.set('role', role, { path: '/' });
};

export const forgetCurrentUser = () => {
  Cookies.remove('address', { path: '/' });
  Cookies.remove('role', { path: '/' });
};

export const getCurrentUser = () => ({
  address: Cookies.get('address', { path: '/' }),
  role: Cookies.get('role', { path: '/' }),
});

export default Cookies;
