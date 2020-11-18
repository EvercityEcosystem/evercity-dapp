import { useEffect } from 'react'

import { forgetCurrentUser } from '../utils/cookies';

const Logout = () => {
  useEffect(() => {
    forgetCurrentUser()
  }, [forgetCurrentUser]);

  return null;
};

export default Logout;
