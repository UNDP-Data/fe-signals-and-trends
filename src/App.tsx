import { AuthenticationResult } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Modal, Select, Switch } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useReducer, useMemo, useState } from 'react';
import { Footer } from './Components/FooterEl';
import { SignUpButton } from './Components/SignUpButton';
import {
  API_ACCESS_TOKEN,
  CHOICES,
  CLIENT_ID,
  REDIRECT_URL,
} from './Constants';
import Context from './Context/Context';
import Reducer from './Context/Reducer';
import MainBody from './MainBody';
import {
  CardsToPrintDataType,
  ChoicesDataType,
  SignalFiltersDataType,
  TrendFiltersDataType,
} from './Types';

import './App.css';
import { Header } from './Components/HeaderEl';
import { SignedOutHomePage } from './HomePage/SignedOutHomepage';
import { signOutClickHandler } from './Utils/SignOutClickHandler';

function App() {
  // eslint-disable-next-line no-console
  console.log(REDIRECT_URL, CLIENT_ID);
  const isAuthenticated = useIsAuthenticated();
  const [openModal, setOpenModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>(
    undefined,
  );
  const [loginError, setLoginError] = useState(false);
  const [accessTokenTemp, setAccessTokenTemp] = useState<string | undefined>(
    undefined,
  );
  const [userRoleTemp, setUserRoleTemp] = useState<string | undefined>(
    undefined,
  );
  const [accLabs, setAccLabs] = useState(false);
  const [expiresOn, setExpiresOn] = useState<Date | undefined>(undefined);
  const initialState = {
    userName: undefined,
    name: undefined,
    unit: undefined,
    role: undefined,
    accessToken: undefined,
    expiresOn: undefined,
    notificationText: undefined,
    choices: undefined,
    isAcceleratorLab: undefined,
    cardsToPrint: [],
    trendFilters: {
      impact: 'All Ratings',
      horizon: 'All Horizons',
      steep_primary: 'All Primary STEEP+V',
      steep_secondary: 'All Secondary STEEP+V',
      sdg: 'All SDGs',
      signature_primary: 'All Primary Signature Solutions/Enabler',
      signature_secondary: 'All Secondary Signature Solutions/Enabler',
      created_for: 'All Options',
      assigned_to: undefined,
      status: 'All Status',
      search: undefined,
    },
    signalFilters: {
      steep_primary: 'All Primary STEEP+V',
      steep_secondary: 'All Secondary STEEP+V',
      sdg: 'All SDGs',
      signature_primary: 'All Primary Signature Solutions/Enabler',
      signature_secondary: 'All Secondary Signature Solutions/Enabler',
      status: 'All Status',
      location: 'All Locations',
      score: 'All Scores',
      created_for: 'All Options',
      created_by: undefined,
      unit_region: 'All Units',
      search: undefined,
    },
    noOfTrendsFiltersActive: 0,
    noOfSignalsFiltersActive: 0,
    signalsSortBy: 'created_at',
    trendsSortBy: 'created_at',
    trendList: undefined,
    signalList: undefined,
  };

  const [state, dispatch] = useReducer(Reducer, initialState);
  const updateNotificationText = (d?: string) => {
    dispatch({
      type: 'UPDATE_NOTIFICATION_TEXT',
      payload: d,
    });
  };

  const updateIsAcceleratorLab = (d?: boolean) => {
    dispatch({
      type: 'UPDATE_IS_ACCELERATOR_LAB',
      payload: d,
    });
  };

  const updateChoices = (d?: ChoicesDataType) => {
    dispatch({
      type: 'UPDATE_CHOICES',
      payload: d,
    });
  };
  const updateCardsToPrint = (d: CardsToPrintDataType[]) => {
    dispatch({
      type: 'UPDATE_CARDS_TO_PRINT',
      payload: d,
    });
  };
  const updateUserName = (d?: string) => {
    dispatch({
      type: 'UPDATE_USERNAME',
      payload: d,
    });
  };
  const updateName = (d?: string) => {
    dispatch({
      type: 'UPDATE_NAME',
      payload: d,
    });
  };
  const updateUnit = (d?: string) => {
    dispatch({
      type: 'UPDATE_UNIT',
      payload: d,
    });
  };
  const updateRole = (d?: 'Admin' | 'Curator' | 'User') => {
    dispatch({
      type: 'UPDATE_ROLE',
      payload: d,
    });
  };
  const updateAccessToken = (d?: string) => {
    dispatch({
      type: 'UPDATE_ACCESS_TOKEN',
      payload: d,
    });
  };
  const updateExpiresOn = (d: Date) => {
    dispatch({
      type: 'UPDATE_EXPIRES_ON',
      payload: d,
    });
  };
  const updateUserID = (d?: number) => {
    dispatch({
      type: 'UPDATE_USER_ID',
      payload: d,
    });
  };
  const updateTrendFilters = (d: TrendFiltersDataType) => {
    dispatch({
      type: 'UPDATE_TREND_FILTERS',
      payload: d,
    });
  };
  const updateSignalFilters = (d: SignalFiltersDataType) => {
    dispatch({
      type: 'UPDATE_SIGNAL_FILTERS',
      payload: d,
    });
  };
  const updateNoOfTrendsFiltersActive = (d: number) => {
    dispatch({
      type: 'UPDATE_NO_OF_TRENDS_FILTERS_ACTIVE',
      payload: d,
    });
  };
  const updateNoOfSignalsFiltersActive = (d: number) => {
    dispatch({
      type: 'UPDATE_NO_OF_SIGNALS_FILTERS_ACTIVE',
      payload: d,
    });
  };
  const updateTrendsSortBy = (d: string) => {
    dispatch({
      type: 'UPDATE_TRENDS_SORT_BY',
      payload: d,
    });
  };
  const updateSignalsSortBy = (d: string) => {
    dispatch({
      type: 'UPDATE_SIGNALS_SORT_BY',
      payload: d,
    });
  };
  const updateTrendList = (d: string) => {
    dispatch({
      type: 'UPDATE_TREND_LIST',
      payload: d,
    });
  };
  const updateSignalList = (d: string) => {
    dispatch({
      type: 'UPDATE_SIGNAL_LIST',
      payload: d,
    });
  };
  const { accounts, instance } = useMsal();
  useEffect(() => {
    axios
      .get(`https://signals-and-trends-api.azurewebsites.net/v1/choices/list`, {
        headers: {
          access_token: API_ACCESS_TOKEN,
        },
      })
      .then((response: AxiosResponse) => {
        updateChoices(response.data);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn(err);
      });
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      const accessTokenRequest = {
        scopes: [`${CLIENT_ID}/.default`],
        account: accounts[0],
      };
      try {
        instance
          .acquireTokenSilent(accessTokenRequest)
          .then((accessTokenResponse: AuthenticationResult) => {
            setLoginError(false);
            updateAccessToken(accessTokenResponse.accessToken);
            setAccessTokenTemp(accessTokenResponse.accessToken);
            setExpiresOn(accessTokenResponse.expiresOn as Date);
            updateExpiresOn(accessTokenResponse.expiresOn as Date);
            axios
              .get(
                'https://signals-and-trends-api.azurewebsites.net/v1/users/me',
                {
                  headers: {
                    access_token: accessTokenResponse.accessToken,
                  },
                },
              )
              .then((res: AxiosResponse) => {
                updateUserName(res.data.email);
                updateName(res.data.name);
                updateUnit(res.data.unit);
                updateRole(res.data.role);
                setUserRoleTemp(res.data.role);
                updateUserID(res.data.id);
                updateIsAcceleratorLab(res.data.acclab !== null);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!res.data.unit) {
                  setOpenModal(true);
                }
              })
              .catch((err: AxiosError) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((err.response?.data as any).detail === 'User not found.') {
                  setOpenModal(true);
                }
              });
            setInterval(async () => {
              const now = new Date().getTime() / 1000;
              if (expiresOn && expiresOn.getTime() / 1000 < now) {
                try {
                  const refreshedAccessToken =
                    await instance.acquireTokenSilent({
                      ...accessTokenRequest,
                      forceRefresh: true,
                    });
                  updateAccessToken(refreshedAccessToken.accessToken);
                  setExpiresOn(refreshedAccessToken.expiresOn as Date);
                  updateExpiresOn(refreshedAccessToken.expiresOn as Date);
                } catch (error) {
                  // eslint-disable-next-line no-console
                }
              }
            }, 60000);
          })
          .catch(_error => {
            setLoginError(true);
          });
      } catch (error) {
        setLoginError(true);
      }
    }
  }, [isAuthenticated, instance]);
  const contextValue = useMemo(
    () => ({
      ...state,
      updateUserName,
      updateName,
      updateRole,
      updateUnit,
      updateAccessToken,
      updateExpiresOn,
      updateUserID,
      updateNotificationText,
      updateCardsToPrint,
      updateIsAcceleratorLab,
      updateSignalFilters,
      updateTrendFilters,
      updateNoOfTrendsFiltersActive,
      updateNoOfSignalsFiltersActive,
      updateSignalsSortBy,
      updateTrendsSortBy,
      updateTrendList,
      updateSignalList,
    }),
    [
      state,
      updateUserName,
      updateRole,
      updateUnit,
      updateName,
      updateAccessToken,
      updateExpiresOn,
      updateUserID,
      updateNotificationText,
      updateCardsToPrint,
      updateIsAcceleratorLab,
      updateSignalFilters,
      updateTrendFilters,
      updateNoOfTrendsFiltersActive,
      updateNoOfSignalsFiltersActive,
      updateSignalsSortBy,
      updateTrendsSortBy,
      updateTrendList,
      updateSignalList,
    ],
  );
  return (
    <Context.Provider value={contextValue}>
      {!loginError ? (
        <div
          className='undp-container'
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <MainBody />
          <Footer />
        </div>
      ) : (
        <div
          className='undp-container'
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Header signOutClickHandler={signOutClickHandler} loginError />
          <SignedOutHomePage />
          <Footer />
        </div>
      )}
      <Modal open={openModal} className='undp-modal'>
        <h5 className='undp-typography bold margin-bottom-07'>
          Welcome to the UNDP Signal and Trends Portal
        </h5>
        <p className='undp-typography label'>
          Please select the unit you belong to
        </p>
        <Select
          className='undp-select margin-bottom-00'
          placeholder='Select a unit'
          onChange={e => {
            setSelectedUnit(e);
          }}
          value={selectedUnit}
          showSearch
        >
          {CHOICES.units.map((d, i) => (
            <Select.Option className='undp-select-option' key={i} value={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
        <p className='undp-typography label margin-top-07'>
          Are you part of Accelerator Labs?
        </p>
        <Switch
          className='undp-switch'
          checked={accLabs}
          onChange={el => setAccLabs(el)}
        />
        <p className='undp-typography italics small-font margin-top-07 margin-bottom-05'>
          The Future Trends and Signals System is internal to UNDP staff only.
          If you submit a signal, you are consenting that UNDP staff will be
          able to view the information you provide in the “Add signal” form,
          including your email address. The signals you submit may also be
          printed by a staff member and shared with external partners. This
          print view will include all signal information, with the exception of
          your name, email address, and CO/Unit.
        </p>
        {selectedUnit && accessTokenTemp && userRoleTemp ? (
          <SignUpButton
            unit={selectedUnit}
            setOpenModal={setOpenModal}
            accLabs={accLabs}
            accessTokenTemp={accessTokenTemp}
            userRoleTemp={userRoleTemp}
          />
        ) : (
          <button
            type='button'
            className='undp-button primary-button button-arrow disabled'
            disabled
          >
            Sign Up
          </button>
        )}
      </Modal>
    </Context.Provider>
  );
}

export default App;
