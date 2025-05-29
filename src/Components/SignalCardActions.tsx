import { NavLink } from 'react-router-dom';
import type { CardsToPrintDataType, SignalDataType } from '../Types';

interface SignalCardActionsProps {
  data: SignalDataType;
  isDraft?: boolean;
  cardsToPrint: CardsToPrintDataType[];
  updateCardsToPrint: (cardsToPrint: CardsToPrintDataType[]) => void;
}

export function SignalCardActions({
  data,
  isDraft,
  cardsToPrint,
  updateCardsToPrint,
}: SignalCardActionsProps) {
  return (
    <div
      className='flex-div gap-00'
      style={{
        justifyContent: 'space-between',
        borderTop: '1px solid var(--gray-400)',
        margin: '1.5rem 0 0 0',
        padding: '0',
      }}
    >
      <NavLink
        to={
          isDraft
            ? `/signals/${data.id}/edit`
            : data.status === 'Archived'
            ? `/archived-signals/${data.id}`
            : `/signals/${data.id}`
        }
        style={{
          textDecoration: 'none',
          borderRight: '1px solid var(--gray-400)',
          flexGrow: 1,
          marginBottom: '-1rem',
          paddingBottom: 0,
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <button
          className='undp-button button-tertiary button-arrow'
          type='button'
        >
          {isDraft ? 'Edit Draft' : 'Read More'}
        </button>
      </NavLink>
      
      {/* Download Button */}
      {isDraft ? null : (
        <button
          className={`undp-button button-tertiary button-arrow${
            cardsToPrint.findIndex(
              el =>
                el.id === `${data.id}` &&
                el.mode === 'card' &&
                el.type === 'signal',
            ) !== -1
              ? 'disabled'
              : ''
          }`}
          disabled={
            cardsToPrint.findIndex(
              el =>
                el.id === `${data.id}` &&
                el.mode === 'card' &&
                el.type === 'signal',
            ) !== -1
          }
          style={{
            opacity:
              cardsToPrint.findIndex(
                el =>
                  el.id === `${data.id}` &&
                  el.mode === 'card' &&
                  el.type === 'signal',
              ) !== -1
                ? 0.4
                : 1,
            cursor:
              cardsToPrint.findIndex(
                el =>
                  el.id === `${data.id}` &&
                  el.mode === 'card' &&
                  el.type === 'signal',
              ) !== -1
                ? 'not-allowed'
                : 'pointer',
            flexGrow: 1,
            marginBottom: '-1rem',
            paddingBottom: 0,
          }}
          type='button'
          onClick={e => {
            e.stopPropagation();
            if (
              cardsToPrint.findIndex(
                el =>
                  el.id === `${data.id}` &&
                  el.mode === 'card' &&
                  el.type === 'signal',
              ) === -1
            ) {
              const cardToPrintTemp = [...cardsToPrint];
              cardToPrintTemp.push({
                type: 'signal',
                mode: 'card',
                id: `${data.id}`,
              });
              updateCardsToPrint(cardToPrintTemp);
            }
          }}
        >
          {cardsToPrint.findIndex(
            el =>
              el.id === `${data.id}` &&
              el.mode === 'card' &&
              el.type === 'signal',
          ) === -1
            ? 'Download'
            : 'Added to PDF'}
        </button>
      )}
    </div>
  );
} 