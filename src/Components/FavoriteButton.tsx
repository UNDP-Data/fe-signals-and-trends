import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { navLinks } from '../Constants';
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

  const tooltipTitle = isFavorite 
    ? "Remove from favorites" 
    : "Add to favorites - Save this signal for easy access later";

  const button = (
    <Tooltip title={tooltipTitle} placement="top">
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
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
          <>
            <FontAwesomeIcon
              icon={isFavorite ? solidHeart : regularHeart}
              style={{
                color: isFavorite ? iconColor : 'black',
                fontSize: getFontSize(),
              }}
            />
            <span className="undp-typography small-font">
              {isFavorite ? "Saved to favorites" : "Save to favorites"}
            </span>
          </>
        )}
      </button>
    </Tooltip>
  );

  return (
    <>
      {button}
      <Modal 
        className="undp-modal" 
        open={openModal} 
        onCancel={closeModal}
        title={isFavorite ? "Added to Favorites" : "Removed from Favorites"}
        footer={[
          <button 
            key="close" 
            onClick={closeModal} 
            className="undp-button button-secondary"
          >
            Close
          </button>,
          isFavorite && (
            <NavLink key="view-favorites" to="/my-favorites">
              <button className="undp-button button-primary">
                View My Favorites
              </button>
            </NavLink>
          )
        ]}
      >
        {isFavorite ? (
          <div>
            <p className="undp-typography">
              This signal has been added to your favorites collection. You can access all your 
              favorite signals anytime by visiting your <NavLink to={navLinks.myFavorites}>Favorites</NavLink> page.
            </p>
          </div>
        ) : (
          <p className="undp-typography">
            This signal has been removed from your favorites collection.
          </p>
        )}
      </Modal>
    </>
  );
} 