import useLocation from 'wouter/use-location';

import { getRole } from './cookies';

export const useCheckAuth = () => {
  const [path, setLocation] = useLocation();
  const currentRole = getRole();

  if (!currentRole) {
    window.location.href = `/login?redirect=${path}`;
    return ['/403', setLocation];
  }

  return [path, setLocation];
};

export const useCheckRole = desiredRole => {
  const [path, setLocation] = useLocation();
  const currentRole = getRole();

  if (currentRole !== desiredRole) {
    window.location.href = `/login?redirect=${path}`;
    return ['/403', setLocation];
  }

  return [path, setLocation];
}
