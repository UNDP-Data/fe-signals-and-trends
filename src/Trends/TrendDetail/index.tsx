import { Popconfirm } from 'antd';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import Background from '../../assets/UNDP-hero-image.jpg';
import { SignalDataType, TrendDataType } from '../../Types';
import { API_ACCESS_TOKEN, MONTHS, SSCOLOR } from '../../Constants';
import { SignalCard } from '../../Components/SignalCard';
import { SignInButton } from '../../Components/SignInButton';
import Context from '../../Context/Context';
import { ChipEl } from '../../Components/ChipEl';
import { ImpactCircleEl } from '../../Components/ImpactRatingEl';
import { getSDGIcon } from '../../Utils/GetSDGIcons';

interface HeroImageProps {
  bgImage?: string;
}

const HeroImageEl = styled.div<HeroImageProps>`
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url(${props => (props.bgImage ? props.bgImage : Background)}) no-repeat
      center;
  background-size: cover;
  margin-top: 7.1875rem;
`;

export function TrendDetail() {
  const [data, setData] = useState<TrendDataType | undefined>(undefined);
  const [connectedSignals, setConnectedSignal] = useState<
    SignalDataType[] | undefined
  >(undefined);
  const [error, setError] = useState<undefined | string>(undefined);
  const { id } = useParams();
  const {
    role,
    accessToken,
    updateNotificationText,
    choices,
    updateCardsToPrint,
    cardsToPrint,
  } = useContext(Context);
  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [submittingError, setSubmittingError] = useState<undefined | string>(
    undefined,
  );
  useEffect(() => {
    axios
      .get(
        `https://signals-and-trends-api.azurewebsites.net/v1/trends/fetch?ids=${id}`,
        {
          headers: {
            access_token: accessToken || API_ACCESS_TOKEN,
          },
        },
      )
      .then((response: AxiosResponse) => {
        setData(response.data[0]);
        if (response.data[0].connected_signals?.length) {
          const signalIds = response.data[0].connected_signals
            .toString()
            .replaceAll(',', '&ids=');
          axios
            .get(
              `https://signals-and-trends-api.azurewebsites.net/v1/signals/fetch?ids=${signalIds}`,
              {
                headers: {
                  access_token: accessToken || API_ACCESS_TOKEN,
                },
              },
            )
            .then((res: AxiosResponse) => {
              setConnectedSignal(res.data);
            })
            .catch(err => {
              setError(
                `Error code ${err.response?.status}: ${
                  err.response?.status === 404
                    ? 'No trend available with the selected IDs'
                    : err.response?.data
                }. ${
                  err.response?.status === 500
                    ? 'Please try again in some time'
                    : ''
                }`,
              );
            });
        } else {
          setConnectedSignal([]);
        }
      });
  }, [id]);
  return (
    <div>
      {data ? (
        <div className='margin-bottom-13'>
          <HeroImageEl className='undp-hero-image' bgImage={data.attachment}>
            <div className='max-width'>
              <div className='flex-div margin-top-00 margin-bottom-09'>
                <NavLink
                  to='/'
                  style={{
                    textDecoration: 'none',
                    color: 'var(--white)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Home
                </NavLink>
                <div
                  style={{
                    textDecoration: 'none',
                    color: 'var(--white)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  /
                </div>
                <NavLink
                  to={
                    data.status === 'Archived' ? '/archived-trends' : '/trends'
                  }
                  style={{
                    textDecoration: 'none',
                    color: 'var(--white)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {data.status === 'Archived'
                    ? 'All Archived Trends'
                    : 'All Trends'}
                </NavLink>
                <div
                  style={{
                    textDecoration: 'none',
                    color: 'var(--white)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  /
                </div>
                <div
                  style={{
                    textDecoration: 'none',
                    color: 'var(--white)',
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
              <h2 className='undp-typography'>{data.headline}</h2>
              <h6 className='undp-typography margin-bottom-07'>
                ID: {data.id}
              </h6>
              {role === 'Admin' || role === 'Curator' ? (
                <div
                  className={`undp-chip margin-bottom-07 ${
                    data.status === 'Approved'
                      ? 'undp-chip-green'
                      : data.status === 'New'
                      ? 'undp-chip-yellow'
                      : 'undp-chip-red'
                  }`}
                  style={{ color: 'var(--black)' }}
                >
                  {data.status === 'New' ? 'Awaiting Approval' : data.status}
                </div>
              ) : null}
            </div>
          </HeroImageEl>
          <div
            className='margin-top-09 margin-bottom-09 flex-div gap-09 max-width'
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingLeft: '2rem',
              paddingRight: '2rem',
              flexWrap: 'wrap-reverse',
            }}
          >
            <div
              style={{
                width: 'calc(33.33% - 2rem)',
                minWidth: '20rem',
                flexGrow: 1,
              }}
            >
              <div>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  Time Horizon
                </h6>
                <div className='flex-div flex-wrap margin-bottom-07'>
                  <ChipEl
                    text={data.time_horizon}
                    circleColor={
                      !choices
                        ? 'var(--black)'
                        : UNDPColorModule.categoricalColors.colors[
                            8 -
                              (choices.horizons.findIndex(
                                el => el === data.time_horizon,
                              ) as number)
                          ]
                    }
                  />
                </div>
              </div>
              <div className='margin-top-07'>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  Impact Rating
                </h6>
                <div className='flex-div flex-wrap margin-bottom-07'>
                  <ImpactCircleEl impact={data.impact_rating} />
                </div>
              </div>
              <div className='margin-top-07'>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  STEEP+V Category
                </h6>
                <div className='flex-div flex-wrap'>
                  {data.steep_primary ? (
                    <ChipEl
                      text={data.steep_primary?.split(' – ')[0]}
                      circleColor={
                        !choices
                          ? 'var(--black)'
                          : UNDPColorModule.categoricalColors.colors[
                              choices.steepv.findIndex(
                                el => el === data.steep_primary,
                              )
                            ]
                      }
                    />
                  ) : (
                    'NA'
                  )}
                  {data.steep_secondary
                    ?.filter(d => d !== data.steep_primary)
                    .map((d, j) => (
                      <ChipEl
                        key={j}
                        text={d.split(' – ')[0]}
                        circleColor={
                          !choices
                            ? 'var(--black)'
                            : UNDPColorModule.categoricalColors.colors[
                                choices.steepv.findIndex(el => el === d)
                              ]
                        }
                      />
                    ))}
                </div>
              </div>
              <div className='margin-top-07'>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  Signature Solutions
                </h6>
                <div className='flex-div flex-wrap'>
                  {data.signature_primary !== '' && data.signature_primary ? (
                    <ChipEl
                      text={data.signature_primary}
                      circleColor={
                        !choices
                          ? 'var(--black)'
                          : SSCOLOR[
                              choices.signatures.findIndex(
                                el => el === data.signature_primary,
                              )
                            ].textColor
                      }
                    />
                  ) : (
                    'NA'
                  )}
                  {data.signature_secondary
                    ?.filter(d => d !== data.signature_primary)
                    .map((d, i) => (
                      <ChipEl
                        text={d}
                        key={i}
                        circleColor={
                          !choices
                            ? 'var(--black)'
                            : SSCOLOR[
                                choices.signatures.findIndex(el => el === d)
                              ].textColor
                        }
                      />
                    ))}
                </div>
              </div>
              {role === 'Admin' || role === 'Curator' ? (
                <div className='margin-top-07'>
                  <div>
                    <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                      Created by
                    </h6>
                    <p className='undp-typography small-font'>
                      {`${data.created_by} on ${new Date(
                        data.created_at,
                      ).getDate()}-${
                        MONTHS[new Date(data.created_at).getMonth()]
                      }-${new Date(data.created_at).getFullYear()}`}
                    </p>
                  </div>
                </div>
              ) : null}
              <hr className='undp-style light margin-top-07' />
              <div className='margin-top-07'>
                <AuthenticatedTemplate>
                  <div
                    className='flex-div margin-bottom-03'
                    style={{ justifyContent: 'space-between' }}
                  >
                    {role === 'User' ? (
                      <p
                        className='undp-typography'
                        style={{ color: 'var(--dark-red)' }}
                      >
                        Admin or curator rights required to edit a trend
                      </p>
                    ) : (
                      <div
                        className='flex-div gap-05'
                        style={{
                          justifyContent: 'space-between',
                          flexDirection: 'column',
                        }}
                      >
                        <NavLink
                          to={
                            data.status === 'Archived'
                              ? `/archived-trends/${id}/edit`
                              : `/trends/${id}/edit`
                          }
                          style={{ textDecoration: 'none' }}
                        >
                          <button
                            className='undp-button button-secondary button-arrow'
                            type='button'
                          >
                            Edit Trend
                          </button>
                        </NavLink>
                        {data.status === 'Archived' ? (
                          <Popconfirm
                            title='Delete Trend'
                            description='Are you sure to delete this trend?'
                            onConfirm={() => {
                              axios({
                                method: 'delete',
                                url: `https://signals-and-trends-api.azurewebsites.net/v1/trends/delete?ids=${id}`,
                                data: {},
                                headers: {
                                  'Content-Type': 'application/json',
                                  access_token: accessToken,
                                },
                              })
                                .then(() => {
                                  setButtonDisabled(false);
                                  navigate('../../archived-trends');
                                  updateNotificationText(
                                    'Successfully deleted the trend',
                                  );
                                })
                                .catch(err => {
                                  setButtonDisabled(false);
                                  setSubmittingError(
                                    `Error code ${err.response?.status}: ${
                                      err.response?.data
                                    }. ${
                                      err.response?.status === 500
                                        ? 'Please try again in some time'
                                        : ''
                                    }`,
                                  );
                                });
                            }}
                            okText='Yes'
                            cancelText='No'
                          >
                            <button
                              className='undp-button button-primary button-arrow'
                              type='button'
                            >
                              Delete Trend
                            </button>
                          </Popconfirm>
                        ) : null}
                      </div>
                    )}
                  </div>
                </AuthenticatedTemplate>
                <button
                  className={`undp-button button-tertiary button-arrow${
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${data.id}` &&
                        el.mode === 'detail' &&
                        el.type === 'trend',
                    ) !== -1
                      ? 'disabled'
                      : ''
                  }`}
                  disabled={
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${data.id}` &&
                        el.mode === 'detail' &&
                        el.type === 'trend',
                    ) !== -1
                  }
                  style={{
                    opacity:
                      cardsToPrint.findIndex(
                        el =>
                          el.id === `${data.id}` &&
                          el.mode === 'detail' &&
                          el.type === 'trend',
                      ) !== -1
                        ? 0.4
                        : 1,
                    cursor:
                      cardsToPrint.findIndex(
                        el =>
                          el.id === `${data.id}` &&
                          el.mode === 'detail' &&
                          el.type === 'trend',
                      ) !== -1
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                  type='button'
                  onClick={() => {
                    if (
                      cardsToPrint.findIndex(
                        el =>
                          el.id === `${data.id}` &&
                          el.mode === 'detail' &&
                          el.type === 'trend',
                      ) === -1
                    ) {
                      const cardToPrintTemp = [...cardsToPrint];
                      cardToPrintTemp.push({
                        type: 'trend',
                        mode: 'detail',
                        id: `${data.id}`,
                      });
                      updateCardsToPrint(cardToPrintTemp);
                    }
                  }}
                >
                  {cardsToPrint.findIndex(
                    el =>
                      el.id === `${data.id}` &&
                      el.mode === 'detail' &&
                      el.type === 'trend',
                  ) === -1
                    ? 'Download'
                    : 'Added to PDF'}
                </button>
                {buttonDisabled ? <div className='undp-loader' /> : null}
                {submittingError ? (
                  <p
                    className='margin-top-00 margin-bottom-00'
                    style={{ color: 'var(--dark-red)' }}
                  >
                    {submittingError}
                  </p>
                ) : null}
                <UnauthenticatedTemplate>
                  <SignInButton buttonText='Sign In to Edit Trends' />
                </UnauthenticatedTemplate>
              </div>
            </div>
            <div style={{ width: 'calc(66.67% - 2rem)', flexGrow: 1 }}>
              <div>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  Description
                </h6>
                <p className='undp-typography'>{data.description}</p>
              </div>
              <div className='margin-top-07'>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  Impact Description
                </h6>
                <p className='undp-typography'>{data.impact_description}</p>
              </div>
              <div className='margin-top-07'>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  SDGs
                </h6>
                <div className='flex-div'>
                  {data.sdgs && data.sdgs.length > 0 ? (
                    <>
                      {data.sdgs.map((sdg, j) => (
                        <div key={j}>{getSDGIcon(sdg.split(':')[0], 48)}</div>
                      ))}
                    </>
                  ) : (
                    'NA'
                  )}
                </div>
              </div>
              <div className='margin-top-07'>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  Connected Signals (
                  {connectedSignals?.filter(d => d.status === 'Approved')
                    .length || 0}
                  )
                </h6>
                {connectedSignals ? (
                  <div className='flex-div flex-wrap connected'>
                    {connectedSignals.filter(d => d.status === 'Approved')
                      .length > 0 ? (
                      <>
                        {connectedSignals
                          .filter(d => d.status === 'Approved')
                          .map((d, i) => (
                            <SignalCard key={i} data={d} />
                          ))}
                      </>
                    ) : (
                      <p className='undp-typography margin-bottom-00'>
                        No connected signals
                      </p>
                    )}
                  </div>
                ) : error ? (
                  <p
                    className='margin-top-00 margin-bottom-00 undp-typography'
                    style={{ color: 'var(--dark-red)' }}
                  >
                    {error}
                  </p>
                ) : (
                  <div className='undp-loader-container'>
                    <div className='undp-loader' />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='undp-loader-container margin-top-13'>
          <div className='undp-loader' />
        </div>
      )}
    </div>
  );
}
