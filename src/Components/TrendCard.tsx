import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { TrendDataType } from '../Types';
import Background from '../assets/UNDP-hero-image.jpg';
import Context from '../Context/Context';

import '../styles.css';
import { ChipEl } from './ChipEl';
import { ImpactCircleEl } from './ImpactRatingEl';

interface Props {
  data: TrendDataType;
  forHomePage?: boolean;
  forAllTrends?: boolean;
}
interface HeroImageProps {
  bgImage?: string;
}

const ImageContainerEl = styled.div<HeroImageProps>`
  width: 100%;
  display: flex;
  @media (max-width: 600px) {
    display: none;
  }
`;
const HeroImageEl = styled.div<HeroImageProps>`
  background: ${props =>
      props.bgImage ? `url(${props.bgImage})` : `url(${Background})`}
    no-repeat center;
  background-size: cover;
  filter: brightness(100%);
  width: 100%;
  justify-items: stretch;
  &:hover {
    filter: brightness(80%);
    transition: filter 0.2s;
  }
  @media (max-width: 600px) {
    display: none;
  }
`;

const CardEl = styled.div`
  flex-grow: 1;
  width: 100%;
  font-size: 1.4rem;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DescriptionEl = styled.p`
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-wrap: break-word;
  -webkit-box-orient: vertical;
`;

const ChipElForStatus = styled.div`
  border-radius: '0 0.5rem 0.5rem 0';
  display: none;
  @media (max-width: 600px) {
    display: inline-block;
  }
`;

const LinkP = styled.p`
  color: var(--gray-700);
  &:hover {
    color: var(--red);
  }
`;

export function TrendCard(props: Props) {
  const { data, forHomePage, forAllTrends } = props;
  const { role, choices, cardsToPrint, updateCardsToPrint } =
    useContext(Context);

  return (
    <div
      className={
        forHomePage
          ? 'trend-card-for-homepage'
          : forAllTrends
          ? 'trend-card-for-listing'
          : 'trend-card'
      }
    >
      <CardEl>
        <div
          className='flex-div gap-00'
          style={{ alignItems: 'stretch', flexGrow: 1 }}
        >
          <NavLink
            className='trend-image flex-div'
            style={{
              justifyContent: 'stretch',
            }}
            to={
              data.status === 'Archived'
                ? `/archived-trends/${data.id}`
                : `/trends/${data.id}`
            }
          >
            <ImageContainerEl>
              <HeroImageEl bgImage={data.attachment}>
                {role === 'Admin' || role === 'Curator' ? (
                  <div
                    className={`undp-chip margin-bottom-07 ${
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
              </HeroImageEl>
            </ImageContainerEl>
          </NavLink>
          <div
            style={{
              padding: '0 1rem 1rem 1rem',
              width: 'calc(66.667% - 1rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flexGrow: 1,
            }}
          >
            <div>
              <NavLink
                style={{ textDecoration: 'none' }}
                to={
                  data.status === 'Archived'
                    ? `/archived-trends/${data.id}`
                    : `/trends/${data.id}`
                }
              >
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
              </NavLink>
              {role === 'Admin' || role === 'Curator' ? (
                <ChipElForStatus
                  className={`undp-chip margin-bottom-07 ${
                    data.status === 'Approved'
                      ? 'undp-chip-green'
                      : data.status === 'New'
                      ? 'undp-chip-yellow'
                      : 'undp-chip-red'
                  }`}
                >
                  {data.status === 'New' ? 'Awaiting Approval' : data.status}
                </ChipElForStatus>
              ) : null}
              <DescriptionEl className='undp-typography small-font margin-bottom-04'>
                {data.description}
              </DescriptionEl>
            </div>
            <div>
              <div className='flex-div margin-bottom-03 gap-05 flex-wrap'>
                {data.time_horizon ? (
                  <div>
                    <p className='bold small-font undp-typography margin-bottom-02'>
                      Time Horizon
                    </p>
                    <ChipEl
                      text={data.time_horizon}
                      circleColor={
                        !choices
                          ? 'var(--black)'
                          : UNDPColorModule.categoricalColors.colors[
                              8 -
                                (choices?.horizons.findIndex(
                                  el => el === data.time_horizon,
                                ) as number)
                            ]
                      }
                    />
                  </div>
                ) : null}
                {data.impact_rating ? (
                  <div>
                    <p className='bold small-font undp-typography margin-bottom-04'>
                      Impact Rating
                    </p>
                    <ImpactCircleEl
                      impact={data.impact_rating}
                      showText={false}
                    />
                  </div>
                ) : null}
              </div>
              <div
                className='flex-div gap-00'
                style={{
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--gray-400)',
                  margin: '1.5rem -1rem 0 -1rem',
                  padding: '0',
                }}
              >
                <NavLink
                  to={
                    data.status === 'Archived'
                      ? `/archived-trends/${data.id}`
                      : `/trends/${data.id}`
                  }
                  style={{
                    textDecoration: 'none',
                    borderRight: '1px solid var(--gray-400)',
                    flexGrow: 1,
                    marginBottom: '-1rem',
                    paddingBottom: '1rem',
                    justifyContent: 'center',
                    display: 'flex',
                  }}
                >
                  <button
                    className='undp-button button-tertiary button-arrow padding-bottom-00'
                    type='button'
                  >
                    Read More
                  </button>
                </NavLink>
                <button
                  className={`undp-button button-tertiary padding-bottom-00 button-arrow${
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${data.id}` &&
                        el.mode === 'card' &&
                        el.type === 'trend',
                    ) !== -1
                      ? 'disabled'
                      : ''
                  }`}
                  type='button'
                  disabled={
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${data.id}` &&
                        el.mode === 'card' &&
                        el.type === 'trend',
                    ) !== -1
                  }
                  onClick={e => {
                    e.stopPropagation();
                    if (
                      cardsToPrint.findIndex(
                        el =>
                          el.id === `${data.id}` &&
                          el.mode === 'card' &&
                          el.type === 'trend',
                      ) === -1
                    ) {
                      const cardToPrintTemp = [...cardsToPrint];
                      cardToPrintTemp.push({
                        type: 'trend',
                        mode: 'card',
                        id: `${data.id}`,
                      });
                      updateCardsToPrint(cardToPrintTemp);
                    }
                  }}
                  style={{
                    opacity:
                      cardsToPrint.findIndex(
                        el =>
                          el.id === `${data.id}` &&
                          el.mode === 'card' &&
                          el.type === 'trend',
                      ) !== -1
                        ? 0.4
                        : 1,
                    cursor:
                      cardsToPrint.findIndex(
                        el =>
                          el.id === `${data.id}` &&
                          el.mode === 'card' &&
                          el.type === 'trend',
                      ) !== -1
                        ? 'not-allowed'
                        : 'pointer',
                    flexGrow: 1,
                    marginBottom: '-1rem',
                    paddingBottom: '1rem',
                  }}
                >
                  {cardsToPrint.findIndex(
                    el =>
                      el.id === `${data.id}` &&
                      el.mode === 'card' &&
                      el.type === 'trend',
                  ) === -1
                    ? 'Download'
                    : 'Added to PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardEl>
    </div>
  );
}
