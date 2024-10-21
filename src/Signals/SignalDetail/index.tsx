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
import { TrendCard } from '../../Components/TrendCard';
import { SignInButton } from '../../Components/SignInButton';
import Context from '../../Context/Context';
import { ChipEl } from '../../Components/ChipEl';
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
                  access_token: accessToken || API_ACCESS_TOKEN,
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
                    data.status === 'Archived'
                      ? '/archived-signals'
                      : '/signals'
                  }
                  style={{
                    textDecoration: 'none',
                    color: 'var(--white)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {data.status === 'Archived'
                    ? 'All Archived Signals'
                    : 'All Signals'}
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
            className='margin-top-09 flex-div gap-07 max-width margin-bottom-09'
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
                  Location
                </h6>
                <div>{data.location}</div>
              </div>
              <div className='margin-top-07'>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  Keywords
                </h6>
                <div className='flex-div flex-wrap'>
                  {data.keywords?.map((el, j) => (
                    <div className='undp-chip' key={j}>
                      {el}
                    </div>
                  ))}
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
                  ) : null}
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
                  ) : null}
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
              <div className='margin-top-07'>
                <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                  Created for
                </h6>
                <div className='small-font'>{data.created_for || 'NA'}</div>
              </div>
              {role === 'Admin' || role === 'Curator' ? (
                <div className='margin-top-07'>
                  <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                    Score
                  </h6>
                  <div className='small-font'>{data.score || 'NA'}</div>
                </div>
              ) : null}
              <AuthenticatedTemplate>
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
                {data.created_unit ? (
                  <div className='margin-top-07'>
                    <div>
                      <h6 className='undp-typography margin-top-00 margin-bottom-03'>
                        Unit
                      </h6>
                      <p className='undp-typography small-font'>
                        {data.created_unit}
                      </p>
                    </div>
                  </div>
                ) : null}
              </AuthenticatedTemplate>
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
                        Admin or curator rights required to edit a signal
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
                              ? `/archived-signals/${id}/edit`
                              : `/signals/${id}/edit`
                          }
                          style={{ textDecoration: 'none' }}
                        >
                          <button
                            className='undp-button button-secondary button-arrow'
                            type='button'
                          >
                            Edit Signal
                          </button>
                        </NavLink>
                        {data.status === 'Archived' ? (
                          <Popconfirm
                            title='Delete Signal'
                            description='Are you sure to delete this signal?'
                            onConfirm={() => {
                              axios({
                                method: 'delete',
                                url: `https://signals-and-trends-api.azurewebsites.net/v1/signals/delete?ids=${id}`,
                                data: {},
                                headers: {
                                  'Content-Type': 'application/json',
                                  access_token: accessToken,
                                },
                              })
                                .then(() => {
                                  setButtonDisabled(false);
                                  navigate('../../archived-signals');
                                  updateNotificationText(
                                    'Successfully deleted the signal',
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
                              Delete Signal
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
                        el.type === 'signal',
                    ) !== -1
                      ? 'disabled'
                      : ''
                  }`}
                  disabled={
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${data.id}` &&
                        el.mode === 'detail' &&
                        el.type === 'signal',
                    ) !== -1
                  }
                  style={{
                    opacity:
                      cardsToPrint.findIndex(
                        el =>
                          el.id === `${data.id}` &&
                          el.mode === 'detail' &&
                          el.type === 'signal',
                      ) !== -1
                        ? 0.4
                        : 1,
                    cursor:
                      cardsToPrint.findIndex(
                        el =>
                          el.id === `${data.id}` &&
                          el.mode === 'detail' &&
                          el.type === 'signal',
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
                          el.type === 'signal',
                      ) === -1
                    ) {
                      const cardToPrintTemp = [...cardsToPrint];
                      cardToPrintTemp.push({
                        type: 'signal',
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
                      el.type === 'signal',
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
                  <SignInButton buttonText='Sign In to Edit Signal' />
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
                  Relevance
                </h6>
                <p className='undp-typography'>{data.relevance}</p>
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
                  Source
                </h6>
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
                  <p className='undp-typography'>{data.url}</p>
                )}
              </div>
              <div className='margin-top-07'>
                <h6 className='undp-typography margin-top-00'>
                  Connected Trends
                </h6>
                {connectedTrends ? (
                  <div className='flex-div flex-wrap connected'>
                    {connectedTrends.filter(d => d.status === 'Approved')
                      .length > 0 ? (
                      <>
                        {connectedTrends
                          .filter(d => d.status === 'Approved')
                          .map((d, i) => (
                            <TrendCard key={i} data={d} />
                          ))}
                      </>
                    ) : (
                      <p className='undp-typography margin-bottom-00'>
                        No connected trends
                      </p>
                    )}
                  </div>
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
