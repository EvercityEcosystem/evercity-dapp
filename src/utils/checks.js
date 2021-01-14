/* eslint-disable react-hooks/rules-of-hooks */
import useLocation from 'wouter/use-location';

import { getCurrentUser } from './storage';

export const checkAuth = () => {
  const [path, setLocation] = useLocation();
  const { role } = getCurrentUser();

  if (!role) {
    window.location.href = `/login?redirect=${path}`;
    return ['/403', setLocation];
  }

  return [path, setLocation];
};

export const checkRole = (desiredRole) => {
  const [path, setLocation] = useLocation();
  const { role } = getCurrentUser();

  if (role !== desiredRole) {
    window.location.href = `/login?redirect=${path}`;
    return ['/403', setLocation];
  }

  return [path, setLocation];
};
