import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { makeSignalFavorite } from '../API';

interface UseFavoriteToggleProps {
  signalId: number;
  initialFavoriteStatus: boolean;
}

interface UseFavoriteToggleReturn {
  isFavorite: boolean;
  openModal: boolean;
  handleFavoriteClick: () => void;
  closeModal: () => void;
}

export const useFavoriteToggle = ({
  signalId,
  initialFavoriteStatus,
}: UseFavoriteToggleProps): UseFavoriteToggleReturn => {
  const [isFavorite, setIsFavorite] = useState(initialFavoriteStatus);
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();
  
  const handleFavoriteClick = () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    
    makeSignalFavorite(signalId, { status: 'created' })
      .then(() => {
        setOpenModal(true);
        console.log(`Signal ${newStatus ? 'added to' : 'removed from'} favorites`);
        
        // Invalidate favorites query to refresh the data
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
      })
      .catch(error => {
        console.error('Error updating favorite status:', error);
        // Revert UI state if API call fails
        setIsFavorite(!newStatus);
      });
  };
  
  const closeModal = () => {
    setOpenModal(false);
  };
  
  return {
    isFavorite,
    openModal,
    handleFavoriteClick,
    closeModal,
  };
}; 