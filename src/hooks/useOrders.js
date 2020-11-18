import { useMemo, useEffect } from 'react';
import { getOr } from 'unchanged';
import { useQuery, useMutation } from 'urql';

import { getAuthHeaders } from '../utils/cookies';

const insertMutation = `
  mutation ($object: orders_insert_input!) {
    insert_orders_one(object: $object) {
      id
    }
  }
`;

const updateMutation = `
  mutation (
    $pk_columns: orders_pk_columns_input!,
    $_set: orders_set_input
  ) {
    update_orders_by_pk(pk_columns: $pk_columns, _set: $_set) {
      status
    }
  }
`;

const userCreatedOrdersQuery = `
  query ($where: orders_bool_exp) {
    orders(where: $where) {
      action
      assigned_to
      id
      status
      created_at
      updated_at
    }
  }
`;

const userAssignedOrdersQuery = `
  query ($where: orders_bool_exp) {
    orders(where: $where) {
      action
      data
      creator_user {
        id
        display_name
      }
      id
      status
      created_at
      updated_at
    }
  }
`;

const assignedCount = `
  query ($where: orders_bool_exp) {
    orders_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export default ({ pauseQueryAll, pagination, ordersType = 'assigned' }) => {
  const [createOrderMutation, execCreateOrderMutation] = useMutation(insertMutation);
  const [updateOrderMutation, execUpdateOrderMutation] = useMutation(updateMutation);

  const authHeaders = getAuthHeaders();
  const currentUserId = authHeaders?.['x-hasura-user-id'];
  const currentRole = authHeaders?.['x-hasura-role'];

  let where = {
    creator: {
      _eq: currentUserId
    }
  };

  if (ordersType === 'assigned') {
    where = {
      assigned_to: {
        _eq: currentUserId
      }
    }
  }

  // allow master to manage unassigned orders
  if (currentRole === 'admin') {
    where = {
      _or: {
        assigned_to: {
          _eq: currentUserId
        },
        assigned_to: {
          _is_null: true
        }
      }
    };
  }

  const [allData, execQueryAll] = useQuery({
    query: ordersType === 'created' ? userCreatedOrdersQuery : userAssignedOrdersQuery,
    pause: true,
    variables: {
      ...(pagination || {}),
      where
    },
  });

  const [allAssignedCount, execAllAssignedCount] = useQuery({
    query: assignedCount,
    pause: true,
    variables: {
      where: {
        _and: {
          ...where,
          status: {
            _eq: 'new'
          }
        }
      }
    },
  });

  useEffect(() => {
    if (!pauseQueryAll) {
      execQueryAll({ requestPolicy: 'cache-and-network' });
    }
  }, [pauseQueryAll, execQueryAll]);

  const all = useMemo(() => getOr([], 'data.orders', allData), [allData]);

  return {
    all,
    queries: {
      allData, execQueryAll,
      allAssignedCount, execAllAssignedCount
    },
    mutations: {
      createOrderMutation, execCreateOrderMutation,
      updateOrderMutation, execUpdateOrderMutation
    },
  };
};
