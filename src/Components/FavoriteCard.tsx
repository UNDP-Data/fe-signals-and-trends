import styled from 'styled-components';
// import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import UNDPColorModule from 'undp-viz-colors';
import Background from '../assets/UNDP-hero-image.jpg';
import Context from '../Context/Context';
import { SignalDataType } from '../Types';
import { FavoriteButton } from './FavoriteButton';

import '../styles.css';
import { ChipEl } from './ChipEl';

interface Props {
  data: SignalDataType;
}

interface HeroImageProps {
  bgImage?: string;
}
const IconContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 0.5rem;
  padding: 0.5rem;
`;
const HeroImageEl = styled.div<HeroImageProps>`
  background: ${props =>
      props.bgImage ? `url(${props.bgImage})` : `url(${Background})`}
    no-repeat center;
  background-size: cover;
  width: 100%;
  height: 0;
  padding-bottom: 55%;
  filter: brightness(100%);
  &:hover {
    filter: brightness(80%);
    transition: filter 0.2s;
  }
  position: relative;
`;

const CardEl = styled.div`
  max-width: 100%;
  flex-grow: 1;
  font-size: 1.4rem;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 1rem;
`;

const DescriptionEl = styled.p`
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-wrap: break-word;
  -webkit-box-orient: vertical;
`;

const LinkP = styled.p`
  color: var(--gray-700);
  &:hover {
    color: var(--red);
  }
`;

export function FavoriteCard(props: Props) {
  const { data } = props;
  const { role, choices } = useContext(Context);
  
  return (
    <div className='signal-card'>
      <CardEl>
        <div>
          <HeroImageEl bgImage={data.attachment}>
            {role === 'Admin' || role === 'Curator' ? (
              <div
                className={`undp-chip margin-bottom-05 ${
                  data.status === 'Approved'
                    ? 'undp-chip-green'
                    : data.status === 'New'
                    ? 'undp-chip-yellow'
                    : 'undp-chip-red'
                }`}
                style={{
                  borderRadius: '0 0.5rem 0.5rem 0',
                  marginTop: '1.5rem',
                  color: 'var(--black)',
                }}
              >
                {data.status === 'New' ? 'Awaiting Approval' : data.status}
              </div>
            ) : null}
            <FavoriteButton
              signalId={data.id}
              initialFavoriteStatus={data.favorite || false}
              size="medium"
              withContainer={true}
              iconColor="orange"
            />
          </HeroImageEl>
          <div style={{ padding: '1rem 1rem 0 1rem' }}>
            <div className='flex-div flex-wrap'>
              <ChipEl
                text={
                  data.steep_primary
                    ? data.steep_primary.split(' – ')[0]
                    : 'No tags'
                }
                circleColor={
                  data.steep_primary
                    ? !choices
                      ? 'var(--black)'
                      : UNDPColorModule.categoricalColors.colors[
                          choices?.steep.findIndex(
                            el => el === data.steep_primary,
                          )
                        ]
                    : 'var(--gray-600)'
                }
              />
              {data.steep_secondary
                ?.filter(s => s !== data.steep_primary)
                .map((s, j) => (
                  <ChipEl
                    key={j}
                    text={s.split(' – ')[0]}
                    circleColor={
                      !choices
                        ? 'var(--black)'
                        : UNDPColorModule.categoricalColors.colors[
                            choices?.steep.findIndex(el => el === s)
                          ]
                    }
                  />
                ))}
            </div>
            <LinkP className='bold undp-typography margin-top-05 margin-bottom-03'>
              {data.headline}{' '}
              <span
                style={{
                  fontSize: '1rem',
                  color: 'var(--gray-600)',
                  fontWeight: 'normal',
                }}
              >
                (ID:{data.id})
              </span>
            </LinkP>
            <DescriptionEl className='undp-typography small-font margin-bottom-04'>
              {data.description}
            </DescriptionEl>
            <p className='small-font undp-typography bold margin-bottom-03 margin-top-03'>
              Keywords
            </p>
            <div className='flex-div flex-wrap margin-bottom-07 gap-03'>
              {data.keywords?.map((el, j) =>
                el !== '' ? (
                  <div className='undp-chip' key={`chip-${j}`}>
                    {el}
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
        <div>
          <div
            className='flex-div gap-00'
            style={{
              justifyContent: 'space-between',
              borderTop: '1px solid var(--gray-400)',
              margin: '1.5rem 0 0 0',
              padding: '0',
            }}
          >
            <NavLink to={`/signals/${data.id}`}>
              <button
                className='undp-button button-tertiary button-arrow'
                type='button'
              >
                View Signal
              </button>
            </NavLink>
          </div>
        </div>
      </CardEl>
    </div>
  );
}
