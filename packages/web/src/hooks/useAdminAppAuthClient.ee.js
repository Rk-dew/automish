import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminAppAuthClient(id) {
  const query = useQuery({
    queryKey: ['adminAppAuthClient', id],
    queryFn: async ({ payload, signal }) => {
      const { data } = await api.get(`/v1/admin/app-auth-clients/${id}`);

      return data;
    },
    enabled: !!id,
  });

  return query;
}
