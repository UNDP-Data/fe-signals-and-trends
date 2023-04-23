import { NavLink, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { SignalDataType, TrendDataType } from '../../Types';
import {
  API_ACCESS_TOKEN,
  MONTHS,
  SDGCOLOR,
  SSCOLOR,
  STEEPVCOLOR,
} from '../../Constants';
import { TrendCard } from '../../Components/TrendCard';
import { SignInButton } from '../../Components/SignInButton';
import Context from '../../Context/Context';

function isValidUrl(url?: string) {
  if (!url) return false;
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
export function SignalDetail() {
  const [data, setData] = useState<SignalDataType | undefined>(undefined);
  const [connectedTrends, setConnectedTrends] = useState<
    TrendDataType[] | undefined
  >(undefined);
  const { id } = useParams();
  const { role, accessToken } = useContext(Context);
  useEffect(() => {
    axios
      .get(
        `https://signals-and-trends-api.azurewebsites.net/v1/signals/fetch?ids=${id}`,
        {
          headers: {
            access_token: accessToken || API_ACCESS_TOKEN,
          },
        },
      )
      .then((response: AxiosResponse) => {
        setData(response.data[0]);
        if (response.data[0].connected_trends?.length) {
          const trendsIds = response.data[0].connected_trends
            .toString()
            .replaceAll(',', '&ids=');
          axios
            .get(
              `https://signals-and-trends-api.azurewebsites.net/v1/trends/fetch?ids=${trendsIds}`,
              {
                headers: {
                  access_token: API_ACCESS_TOKEN,
                },
              },
            )
            .then((res: AxiosResponse) => {
              setConnectedTrends(res.data);
            });
        } else {
          setConnectedTrends([]);
        }
      });
  }, [id, accessToken]);
  return (
    <div
      className='margin-top-13 padding-top-09'
      style={{
        maxWidth: '60rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      {data ? (
        <div className='margin-bottom-13'>
          <div className='flex-div margin-top-07 margin-bottom-09'>
            <NavLink
              to='/'
              style={{
                textDecoration: 'none',
                color: 'var(--dark-red)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              Home
            </NavLink>
            <div
              style={{
                textDecoration: 'none',
                color: 'var(--dark-red)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              /
            </div>
            <NavLink
              to='/signals'
              style={{
                textDecoration: 'none',
                color: 'var(--dark-red)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              All Signals
            </NavLink>
            <div
              style={{
                textDecoration: 'none',
                color: 'var(--dark-red)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              /
            </div>
            <div
              style={{
                textDecoration: 'none',
                color: 'var(--black)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                maxWidth: '5rem',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {data.headline}
            </div>
          </div>
          <h3 className='undp-typography'>{data.headline}</h3>
          <div className='flex-div flex-wrap margin-bottom-07'>
            {data.keywords?.map((el, j) => (
              <div className='undp-chip' key={j}>
                {el}
              </div>
            ))}
          </div>
          <p className='undp-typography'>{data.description}</p>
          <hr className='undp-style light margin-top-07 margin-bottom-07' />
          <h6 className='undp-typography margin-top-00'>STEEP+V Category</h6>
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
          <hr className='undp-style light margin-top-07 margin-bottom-07' />
          <h6 className='undp-typography margin-top-00'>Signature Solutions</h6>
          <div className='flex-div flex-wrap margin-top-03'>
            {data.signature_primary !== '' && data.signature_primary ? (
              <div
                className='undp-chip'
                style={{
                  color:
                    SSCOLOR.findIndex(
                      el => el.value === data.signature_primary,
                    ) !== -1
                      ? SSCOLOR[
                          SSCOLOR.findIndex(
                            el => el.value === data.signature_primary,
                          )
                        ].textColor
                      : 'var(--black)',
                  fontWeight: 'bold',
                }}
              >
                {data.signature_primary}
              </div>
            ) : null}
            {data.signature_secondary !== '' &&
            data.signature_secondary &&
            data.signature_secondary !== data.signature_primary ? (
              <div
                className='undp-chip'
                style={{
                  color:
                    SSCOLOR.findIndex(
                      el => el.value === data.signature_secondary,
                    ) !== -1
                      ? SSCOLOR[
                          SSCOLOR.findIndex(
                            el => el.value === data.signature_secondary,
                          )
                        ].textColor
                      : 'var(--black)',
                  fontWeight: 'bold',
                }}
              >
                {data.signature_secondary}
              </div>
            ) : null}
          </div>
          <hr className='undp-style light margin-top-07 margin-bottom-07' />
          <h6 className='undp-typography margin-top-00'>SDGs</h6>
          <div className='flex-div flex-wrap margin-top-03'>
            {data.sdgs ? (
              <>
                {data.sdgs.map((sdg, j) => (
                  <div
                    key={j}
                    className='undp-chip'
                    style={{
                      color:
                        SDGCOLOR[SDGCOLOR.findIndex(el => el.value === sdg)]
                          .textColor,
                      fontWeight: 'bold',
                    }}
                  >
                    {sdg}
                  </div>
                ))}
              </>
            ) : (
              'NA'
            )}
          </div>
          <hr className='undp-style light margin-top-07 margin-bottom-07' />
          <h6 className='undp-typography margin-top-00'>Relevance</h6>
          <p className='undp-typography margin-top-05'>{data.relevance}</p>
          <hr className='undp-style light margin-top-07 margin-bottom-07' />
          <h6 className='undp-typography margin-top-00'>Source</h6>
          {isValidUrl(data.url) ? (
            <a
              href={data.url}
              target='_blank'
              rel='noreferrer'
              className='undp-style'
            >
              {data.url}
            </a>
          ) : (
            <p className='undp-typography margin-top-05'>{data.url}</p>
          )}
          <hr className='undp-style light margin-top-07 margin-bottom-07' />
          <h6 className='undp-typography margin-top-00'>Connected Trends</h6>
          {connectedTrends ? (
            <div className='flex-div flex-wrap'>
              {connectedTrends.length > 0 ? (
                <>
                  {connectedTrends.map((d, i) => (
                    <TrendCard key={i} data={d} />
                  ))}
                </>
              ) : (
                <p className='undp-typography'>No connected trends</p>
              )}
            </div>
          ) : (
            <div className='undp-loader-container'>
              <div className='undp-loader' />
            </div>
          )}
          <hr className='undp-style light margin-top-07 margin-bottom-07' />
          <h6 className='undp-typography margin-top-00'>Created by</h6>
          <p className='undp-typography margin-top-05 margin-bottom-09'>
            {`${data.created_by} on ${new Date(data.created_at).getDate()}-${
              MONTHS[new Date(data.created_at).getMonth()]
            }-${new Date(data.created_at).getFullYear()}`}
          </p>
          <AuthenticatedTemplate>
            {role === 'Visitor' ? (
              <p
                className='undp-typography'
                style={{ color: 'var(--dark-red)' }}
              >
                You don&apos;t have enough right to edit a signal
              </p>
            ) : (
              <NavLink
                to={`/signals/${id}/edit`}
                style={{ textDecoration: 'none' }}
              >
                <button
                  className='undp-button button-secondary button-arrow'
                  type='button'
                >
                  Edit Signal
                </button>
              </NavLink>
            )}
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <SignInButton buttonText='Sign In to Edit Signal' />
          </UnauthenticatedTemplate>
        </div>
      ) : (
        <div className='undp-loader-container'>
          <div className='undp-loader' />
        </div>
      )}
    </div>
  );
}
