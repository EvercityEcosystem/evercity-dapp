import Cookies from 'js-cookie';

export const saveCurrentUser = (address, role) => {
  if (!address) {
    return;
  }
    Cookies.set('address', address, { path: '/' });
    Cookies.set('role', role, { path: '/' });
};

export const forgetCurrentUser = () => {
  Cookies.remove('address', { path: '/' });
  Cookies.remove('role', role, { path: '/' });
};

export const getAddress = () => Cookies.get('address', { path: '/' });
export const getRole = () => Cookies.get('role', { path: '/' });

export default Cookies;
