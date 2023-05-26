import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { SignalDataType } from '../Types';
import Background from '../assets/UNDP-hero-image.png';
import { STEEPVCOLOR } from '../Constants';
import Context from '../Context/Context';

interface Props {
  data: SignalDataType;
  isDraft?: boolean;
}

interface HeroImageProps {
  bgImage?: string;
}

const HeroImageEl = styled.div<HeroImageProps>`
  background: ${props =>
      props.bgImage ? `url(data:${props.bgImage})` : `url(${Background})`}
    no-repeat center;
  background-size: cover;
  width: 100%;
  height: 20rem;
`;

const CardEl = styled.div`
  flex-grow: 1;
  font-size: 1.4rem;
  word-wrap: break-word;
  cursor: pointer;
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
  padding: 0 1.5rem;
`;

export function SignalCard(props: Props) {
  const { data, isDraft } = props;
  const { role } = useContext(Context);
  return (
    <NavLink
      // eslint-disable-next-line no-underscore-dangle
      to={isDraft ? `/signals/${data.id}/edit` : `/signals/${data.id}`}
      style={{
        color: 'var(--black)',
        textDecoration: 'none',
        width: 'calc(33.33% - 0.67rem)',
        flexGrow: 1,
        flexBasis: '26.25rem',
        backgroundColor: 'var(--gray-200)',
        border: '1px solid var(--gray-400)',
        borderRadius: '0.5rem',
        alignItems: 'stretch',
        display: 'flex',
        /* maxWidth: 'calc(20% - 1rem)', */
      }}
    >
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
                }}
              >
                {data.status === 'New' ? 'Awaiting Approval' : data.status}
              </div>
            ) : null}
          </HeroImageEl>
          <h5
            className='bold undp-typography'
            style={{ padding: '2rem 1.5rem 0 1.5rem' }}
          >
            {data.headline}
          </h5>
          <DescriptionEl className='undp-typography small-font margin-bottom-05'>
            {data.description}
          </DescriptionEl>
          <div className='flex-div flex-wrap' style={{ padding: '0 1.5rem' }}>
            {data.keywords?.map((el, j) =>
              el !== '' ? (
                <div className='undp-chip' key={`chip-${j}`}>
                  {el}
                </div>
              ) : null,
            )}
          </div>
        </div>
        <div style={{ padding: '0 1.5rem 2rem 1.5rem' }}>
          <hr className='undp-style light margin-top-07 margin-bottom-07' />
          <h6 className='margin-bottom-00 margin-top-00'>STEEP+V Category</h6>
          <div className='flex-div flex-wrap margin-top-03'>
            {data.steep ? (
              <div
                className='undp-chip'
                style={{
                  color:
                    STEEPVCOLOR.findIndex(
                      el => el.value === data.steep?.split(' – ')[0],
                    ) === -1
                      ? 'var(--black)'
                      : STEEPVCOLOR[
                          STEEPVCOLOR.findIndex(
                            el => el.value === data.steep?.split(' – ')[0],
                          )
                        ].textColor,
                  fontWeight: 'bold',
                }}
              >
                {data.steep?.split(' – ')[0]}
              </div>
            ) : null}
          </div>
        </div>
      </CardEl>
    </NavLink>
  );
}
