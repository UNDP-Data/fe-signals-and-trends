import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, Spin } from 'antd';
import styled from 'styled-components';
import { useFavoriteToggle } from '../Hooks/useFavoriteToggle';

interface FavoriteButtonProps {
  signalId: number;
  initialFavoriteStatus: boolean;
  size?: 'small' | 'medium' | 'large';
  withContainer?: boolean;
  iconColor?: string;
  inDropdown?: boolean;
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
  inDropdown = false,
}: FavoriteButtonProps) {
  const { isFavorite, isLoading, handleFavoriteClick } =
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
      default:
        return '1.5em';
    }
  };

  const tooltipTitle = isFavorite
    ? "Remove from favorites"
    : "Add to favorites - Save this signal for easy access later";

  const button = (
    <Tooltip title={inDropdown ? undefined : tooltipTitle} placement="top">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFavoriteClick();
        }}
        className={size === 'small' && !inDropdown ? 'undp-button button-tertiary' : ''}
        style={{
          border: 'none',
          background: 'none',
          cursor: isLoading ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: inDropdown ? '0' : (size === 'small' ? '0.25rem 0.5rem' : undefined),
          fontSize: inDropdown ? '0.9em' : (size === 'small' ? '0.875rem' : undefined),
          width: inDropdown ? '100%' : undefined,
          justifyContent: inDropdown ? 'flex-start' : undefined,
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        disabled={isLoading}
      >
        {isLoading ? (
          <Spin size="small" style={{ marginRight: '8px' }} />
        ) : withContainer ? (
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
                fontSize: inDropdown ? '1em' : getFontSize(),
                marginRight: inDropdown ? '8px' : undefined,
              }}
            />
            <span className="undp-typography small-font">
              {inDropdown ? (isFavorite ? "Remove from favorites" : "Add to favorites") :
               (size === 'small' ? (isFavorite ? "Saved" : "Favorite") :
               (isFavorite ? "Saved to favorites" : "Save to favorites"))}
            </span>
          </>
        )}
      </button>
    </Tooltip>
  );

  return button;
} 