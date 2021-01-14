import { useEffect } from 'react';
import useLocation from 'wouter/use-location';

import { forgetCurrentUser } from '../utils/storage';

const Logout = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    forgetCurrentUser();
    setLocation('/login');
  }, [setLocation]);

  return null;
};

export default Logout;
