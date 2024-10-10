import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Modal, notification } from 'antd';
import axios, { AxiosResponse } from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AddNewSignalEl, AddNewTrendEl } from './AddNew';
import { AdminPanel } from './AdminPanel';
import Context from './Context/Context';
import { EditSignal } from './Signals/EditSignal';
import { EditTrend } from './Trends/EditTrend';
import { HomePage } from './HomePage';
import { SignalDetail } from './Signals/SignalDetail';
import { ArchivedSignalsListing, SignalsListing } from './Signals';
import { TrendDetail } from './Trends/TrendDetail';
import { ArchivedTrendsListing, TrendsListing } from './Trends';
import { MyDrafts } from './MyDrafts';
import { API_ACCESS_TOKEN } from './Constants';
import { SignalDataType, TrendDataType } from './Types';
import { PDFDocument } from './PDFGenerator';
import { SignedOutHomePage } from './HomePage/SignedOutHomepage';
import { signOutClickHandler } from './Utils/SignOutClickHandler';
import { Header } from './Components/HeaderEl';

function MainBody() {
  const {
    name,
    choices,
    notificationText,
    updateNotificationText,
    cardsToPrint,
    accessToken,
    updateCardsToPrint,
  } = useContext(Context);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState(false);
  const [trendsForPrinting, setTrendsForPrinting] = useState<
    TrendDataType[] | undefined
  >(undefined);
  const [
    connectedSignalsForTrendsForPrinting,
    setConnectedSignalsForTrendsForPrinting,
  ] = useState<SignalDataType[] | undefined>(undefined);
  const [signalsForPrinting, setSignalsForPrinting] = useState<
    SignalDataType[] | undefined
  >(undefined);
  const [
    connectedTrendsForSignalsForPrinting,
    setConnectedTrendsForSignalsForPrinting,
  ] = useState<TrendDataType[] | undefined>(undefined);
  const showNotification = (text: string) => {
    const handleNotificationClose = () => {
      updateNotificationText(undefined);
    };
    notification.success({
      message: 'Success',
      description: text,
      placement: 'top',
      className: 'undp-notification',
      onClose: handleNotificationClose,
      duration: 5,
    });
  };
  useEffect(() => {
    if (notificationText) {
      showNotification(notificationText);
    }
  }, [notificationText]);
  useEffect(() => {
    setTrendsForPrinting(undefined);
    setSignalsForPrinting(undefined);
    setError(false);
    if (cardsToPrint.filter(d => d.type === 'signal').length > 0) {
      const signalIds = cardsToPrint
        .filter(d => d.type === 'signal')
        .map(d => d.id)
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
          const sList: string[] = [];
          res.data.forEach((d: SignalDataType) => {
            const connectedTrends = d.connected_trends?.filter(
              (_el, i) => i < 5,
            );
            connectedTrends?.forEach(el => {
              if (sList.indexOf(`${el}`) === -1) sList.push(`${el}`);
            });
          });
          if (sList.length > 0) {
            const connectedTrends = sList.toString().replaceAll(',', '&ids=');
            axios
              .get(
                `https://signals-and-trends-api.azurewebsites.net/v1/trends/fetch?ids=${connectedTrends}`,
                {
                  headers: {
                    access_token: accessToken || API_ACCESS_TOKEN,
                  },
                },
              )
              .then((trendRes: AxiosResponse) => {
                setConnectedTrendsForSignalsForPrinting(trendRes.data);
                setSignalsForPrinting(res.data);
              })
              .catch(_err => {
                setError(true);
              });
          } else {
            setConnectedTrendsForSignalsForPrinting([]);
            setSignalsForPrinting(res.data);
          }
        })
        .catch(_err => {
          setError(true);
        });
    } else if (cardsToPrint.length !== 0) {
      setSignalsForPrinting([]);
      setConnectedTrendsForSignalsForPrinting([]);
    }
    if (cardsToPrint.filter(d => d.type === 'trend').length > 0) {
      const signalIds = cardsToPrint
        .filter(d => d.type === 'trend')
        .map(d => d.id)
        .toString()
        .replaceAll(',', '&ids=');
      axios
        .get(
          `https://signals-and-trends-api.azurewebsites.net/v1/trends/fetch?ids=${signalIds}`,
          {
            headers: {
              access_token: accessToken || API_ACCESS_TOKEN,
            },
          },
        )
        .then((res: AxiosResponse) => {
          const sList: string[] = [];
          res.data.forEach((d: TrendDataType) => {
            const connectedSignals = d.connected_signals?.filter(
              (_el, i) => i < 5,
            );
            connectedSignals?.forEach(el => {
              if (sList.indexOf(`${el}`) === -1) sList.push(`${el}`);
            });
          });
          if (sList.length > 0) {
            const connectedSignals = sList.toString().replaceAll(',', '&ids=');
            axios
              .get(
                `https://signals-and-trends-api.azurewebsites.net/v1/signals/fetch?ids=${connectedSignals}`,
                {
                  headers: {
                    access_token: accessToken || API_ACCESS_TOKEN,
                  },
                },
              )
              .then((trendRes: AxiosResponse) => {
                setConnectedSignalsForTrendsForPrinting(trendRes.data);
                setTrendsForPrinting(res.data);
              })
              .catch(_err => {
                setError(true);
              });
          } else {
            setConnectedSignalsForTrendsForPrinting([]);
            setTrendsForPrinting(res.data);
          }
        })
        .catch(_err => {
          setError(true);
        });
    } else if (cardsToPrint.length !== 0) {
      setTrendsForPrinting([]);
      setConnectedSignalsForTrendsForPrinting([]);
    }
  }, [openModal]);
  return (
    <>
      <AuthenticatedTemplate>
        {name && choices ? (
          <>
            <Header signOutClickHandler={signOutClickHandler} />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/signals' element={<SignalsListing />} />
              <Route path='/signals/:id' element={<SignalDetail />} />
              <Route path='/signals/:id/edit' element={<EditSignal />} />
              <Route
                path='/archived-signals'
                element={<ArchivedSignalsListing />}
              />
              <Route path='/archived-signals/:id' element={<SignalDetail />} />
              <Route
                path='/archived-signals/:id/edit'
                element={<EditSignal />}
              />
              <Route path='/trends' element={<TrendsListing />} />
              <Route path='/trends/:id' element={<TrendDetail />} />
              <Route path='/trends/:id/edit' element={<EditTrend />} />
              <Route
                path='/archived-trends'
                element={<ArchivedTrendsListing />}
              />
              <Route path='/archived-trends/:id' element={<TrendDetail />} />
              <Route path='/archived-trends/:id/edit' element={<EditTrend />} />
              <Route path='/add-new-signal' element={<AddNewSignalEl />} />
              <Route path='/add-new-trend' element={<AddNewTrendEl />} />
              <Route path='/admin-panel' element={<AdminPanel />} />
              <Route path='/my-drafts' element={<MyDrafts />} />
            </Routes>
          </>
        ) : (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <>
          <Header signOutClickHandler={signOutClickHandler} />
          <Routes>
            <Route path='/*' element={<SignedOutHomePage />} />
          </Routes>
        </>
      </UnauthenticatedTemplate>
      {cardsToPrint.length > 0 ? (
        <div
          style={{
            backgroundColor: 'var(--gray-200)',
            borderTop: '1px solid var(--gray-400)',
            padding: '0 1rem',
            bottom: 0,
            width: '100%',
            position: 'fixed',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            type='button'
            className='undp-button margin-bottom-00 margin-top-00 button-tertiary button-arrow'
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Download selected
            {cardsToPrint.filter(d => d.type === 'signal').length > 0
              ? ` ${
                  cardsToPrint.filter(d => d.type === 'signal').length
                } signal${
                  cardsToPrint.filter(d => d.type === 'signal').length === 1
                    ? ''
                    : 's'
                }`
              : ''}
            {cardsToPrint.filter(d => d.type === 'signal').length > 0 &&
            cardsToPrint.filter(d => d.type === 'trend').length > 0
              ? ' and'
              : ''}
            {cardsToPrint.filter(d => d.type === 'trend').length > 0
              ? ` ${cardsToPrint.filter(d => d.type === 'trend').length} trend${
                  cardsToPrint.filter(d => d.type === 'trend').length === 1
                    ? ''
                    : 's'
                }`
              : ''}{' '}
            as PDF
          </button>
        </div>
      ) : null}
      <Modal
        className='undp-modal'
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        onOk={() => {
          setOpenModal(false);
        }}
      >
        {error ? (
          <h6 className='undp-typography' style={{ color: 'var(--dark-red)' }}>
            Error loading signals and trends. Please check you don&apos;t have
            more than 50 signals and trends for printing.
          </h6>
        ) : signalsForPrinting &&
          trendsForPrinting &&
          connectedTrendsForSignalsForPrinting &&
          connectedSignalsForTrendsForPrinting ? (
          <>
            <div className='flex-div flex-wrap margin-bottom-09'>
              {cardsToPrint.map((d, i) => {
                if (d.type === 'signal') {
                  const s =
                    signalsForPrinting[
                      signalsForPrinting.findIndex(el => `${el.id}` === d.id)
                    ];
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'var(--gray-200)',
                        width: '100%',
                      }}
                    >
                      <h6
                        className='undp-typography undp-chip margin-top-00 margin-bottom-05 undp-chip-green'
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        Signal
                      </h6>
                      <h6 className='undp-typography'>{s.headline}</h6>
                      <p
                        className='undp-typography margin-bottom-07 small-font'
                        style={{ textAlign: 'left' }}
                      >
                        {s.description}
                      </p>
                      <button
                        type='button'
                        className='undp-button button-tertiary button-arrow'
                        onClick={() => {
                          updateCardsToPrint(
                            cardsToPrint.filter(
                              c =>
                                (c.type === 'signal' && c.id !== d.id) ||
                                c.type === 'trend',
                            ),
                          );
                          if (
                            cardsToPrint.filter(
                              c =>
                                (c.type === 'signal' && c.id !== d.id) ||
                                c.type === 'trend',
                            ).length === 0
                          )
                            setOpenModal(false);
                        }}
                      >
                        Remove from PDF
                      </button>
                    </div>
                  );
                }
                const s =
                  trendsForPrinting[
                    trendsForPrinting.findIndex(el => `${el.id}` === d.id)
                  ];
                return (
                  <div
                    key={i}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'var(--gray-200)',
                      width: '100%',
                    }}
                  >
                    <h6
                      className='undp-typography undp-chip margin-top-00 margin-bottom-05 undp-chip-blue'
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      Trend
                    </h6>
                    <h6 className='undp-typography'>{s.headline}</h6>
                    <p
                      className='undp-typography margin-bottom-07 small-font'
                      style={{ textAlign: 'left' }}
                    >
                      {s.description}
                    </p>
                    <button
                      type='button'
                      className='undp-button button-tertiary button-arrow'
                      onClick={() => {
                        updateCardsToPrint(
                          cardsToPrint.filter(
                            c =>
                              (c.type === 'trend' && c.id !== d.id) ||
                              c.type === 'signal',
                          ),
                        );
                        if (
                          cardsToPrint.filter(
                            c =>
                              (c.type === 'trend' && c.id !== d.id) ||
                              c.type === 'signal',
                          ).length === 0
                        )
                          setOpenModal(false);
                      }}
                    >
                      Remove from PDF
                    </button>
                  </div>
                );
              })}
            </div>
            <PDFDownloadLink
              document={
                <PDFDocument
                  pages={cardsToPrint.map(d =>
                    d.type === 'signal'
                      ? {
                          type: 'signal',
                          data: signalsForPrinting[
                            signalsForPrinting.findIndex(
                              el => `${el.id}` === d.id,
                            )
                          ],
                        }
                      : {
                          type: 'trend',
                          data: trendsForPrinting[
                            trendsForPrinting.findIndex(
                              el => `${el.id}` === d.id,
                            )
                          ],
                        },
                  )}
                  connectedSignalsForTrendsForPrinting={
                    connectedSignalsForTrendsForPrinting
                  }
                  connectedTrendsForSignalsForPrinting={
                    connectedTrendsForSignalsForPrinting
                  }
                />
              }
              fileName='Signals_And_trends.pdf'
              style={{ textDecoration: 'none' }}
              onClick={() => {
                updateCardsToPrint([]);
                setOpenModal(false);
              }}
            >
              {({ url }) =>
                !url ? (
                  <div
                    style={{
                      width: '100%',
                      marginTop: 'var(--spacing-07)',
                      height: '250px',
                      backgroundColor: 'var(--gray-200)',
                      paddingTop: '50px',
                    }}
                  >
                    <div className='undp-loader' style={{ margin: 'auto' }} />
                    <h6
                      className='undp-typography margin-top-05'
                      style={{ textAlign: 'center' }}
                    >
                      Loading PDF... Please wait it might take some time
                    </h6>
                  </div>
                ) : (
                  <button
                    type='button'
                    className='undp-button button-arrow button-primary'
                  >
                    Download PDF
                  </button>
                )
              }
            </PDFDownloadLink>
          </>
        ) : (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        )}
      </Modal>
    </>
  );
}

export default MainBody;
