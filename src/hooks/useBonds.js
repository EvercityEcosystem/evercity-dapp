import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { PRE_INSTALLED_BONDS } from '../utils/env';
import usePolkadot from './usePolkadot';

export default () => {
  const [bonds, setBonds] = useState([]);
  const { bondRegistry } = usePolkadot();

  const indicesArray = useMemo(
    () => localStorage.getItem('bond_index')?.split(',')?.filter((item, index, arr) => arr.indexOf(item) === index) || [],
    [],
  );

  const fetchAll = useCallback(
    () => [...PRE_INSTALLED_BONDS, ...indicesArray].map(async (bondId) => {
      const registry = await bondRegistry(bondId);

      return { id: bondId, registry };
    }),
    [bondRegistry, indicesArray],
  );

  useEffect(
    () => {
      const fetch = async () => {
        const result = await Promise.all(fetchAll());
        const jsonResult = result.map((bondData) => ({
          id: bondData.id,
          ...(bondData?.registry || {}),
        }));

        setBonds(jsonResult);
      };

      fetch();
    },
    [fetchAll, setBonds],
  );

  return {
    bonds, fetchAll,
  };
};
