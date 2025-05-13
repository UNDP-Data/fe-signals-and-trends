import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { notification } from 'antd';
import { makeSignalFavorite } from '../API';
import { NavLink } from 'react-router-dom';
import { navLinks } from '../Constants';

interface UseFavoriteToggleProps {
  signalId: number;
  initialFavoriteStatus: boolean;
}

interface UseFavoriteToggleReturn {
  isFavorite: boolean;
  isLoading: boolean;
  handleFavoriteClick: () => void;
}

export const useFavoriteToggle = ({
  signalId,
  initialFavoriteStatus,
}: UseFavoriteToggleProps): UseFavoriteToggleReturn => {
  const [isFavorite, setIsFavorite] = useState(initialFavoriteStatus);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleFavoriteClick = () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    setIsLoading(true);

    makeSignalFavorite(signalId, { status: 'created' })
      .then(() => {
        console.log(`Signal ${newStatus ? 'added to' : 'removed from'} favorites`);

        // Invalidate favorites query to refresh the data
        queryClient.invalidateQueries({ queryKey: ['favorites'] });

        // Show toast notification with link instead of modal
        if (newStatus) {
          notification.success({
            message: 'Added to Favorites',
            description: `Signal added to favorites. Click to view your favorites.`,
            placement: 'top',
            className: 'undp-notification',
            onClick: () => {
              window.location.href = navLinks.myFavorites;
            },
          });
        } else {
          notification.info({
            message: 'Removed from Favorites',
            description: 'Signal removed from favorites',
            placement: 'top',
            className: 'undp-notification',
          });
        }
      })
      .catch(error => {
        console.error('Error updating favorite status:', error);
        // Revert UI state if API call fails
        setIsFavorite(!newStatus);

        notification.error({
          message: 'Error',
          description: 'Failed to update favorites status',
          placement: 'top',
          className: 'undp-notification',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    isFavorite,
    isLoading,
    handleFavoriteClick,
  };
}; 