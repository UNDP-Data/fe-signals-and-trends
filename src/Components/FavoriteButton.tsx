import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useFavoriteToggle } from '../Hooks/useFavoriteToggle';

interface FavoriteButtonProps {
  signalId: number;
  initialFavoriteStatus: boolean;
  size?: 'small' | 'medium' | 'large';
  withContainer?: boolean;
  iconColor?: string;
}

const IconContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 0.5rem;
  padding: 0.5rem;
`;

export function FavoriteButton({
  signalId,
  initialFavoriteStatus,
  size = 'medium',
  withContainer = false,
  iconColor = 'orange',
}: FavoriteButtonProps) {
  const { isFavorite, openModal, handleFavoriteClick, closeModal } =
    useFavoriteToggle({
      signalId,
      initialFavoriteStatus,
    });

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return '1em';
      case 'large':
        return '2em';
      case 'medium':
      default:
        return '1.5em';
    }
  };

  const button = (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        handleFavoriteClick();
      }}
      style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
      }}
    >
      {withContainer ? (
        <IconContainer>
          <FontAwesomeIcon
            icon={isFavorite ? solidHeart : regularHeart}
            style={{
              color: isFavorite ? iconColor : 'black',
              fontSize: getFontSize(),
            }}
          />
        </IconContainer>
      ) : (
        <FontAwesomeIcon
          icon={isFavorite ? solidHeart : regularHeart}
          style={{
            color: isFavorite ? iconColor : 'black',
            fontSize: getFontSize(),
          }}
        />
      )}
    </button>
  );

  return (
    <>
      {button}
      <Modal className="undp-modal" open={openModal} onCancel={closeModal}>
        {isFavorite ? (
          <NavLink to="/my-favorites">
            <h6 className="undp-typography" style={{ color: 'var(--dark-red)' }}>
              This signal has been added to your favorites.
            </h6>
          </NavLink>
        ) : (
          <h6 className="undp-typography" style={{ color: 'var(--dark-red)' }}>
            This article has been removed from favorites.
          </h6>
        )}
      </Modal>
    </>
  );
} 