import { useQuery } from '@tanstack/react-query';
import sortBy from 'lodash.sortby';
import React from 'react';
import { getfavoriteSignals } from '../API';
import { SignalDataType } from '../Types';

interface UseFavoritesParams {
  page: number;
  pageSize: number;
  onSuccess?: (data: SignalDataType[]) => void;
}

export const useFavorites = ({ page, pageSize, onSuccess }: UseFavoritesParams) => {
  const query = useQuery<SignalDataType[]>({
    queryKey: ['favorites', page, pageSize],
    queryFn: async () => {
      const response = await getfavoriteSignals({
        page,
        per_page: pageSize,
      });
      
      if (response && response.length > 0) {
        const sortedData = sortBy(response, d => Date.parse(d.created_at)).reverse();
        return sortedData;
      }
      
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle onSuccess via useEffect if needed
  React.useEffect(() => {
    if (query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.data, onSuccess]);

  return query;
}; 