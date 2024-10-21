/* eslint-disable @typescript-eslint/no-explicit-any */
export default (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_USERNAME':
      return { ...state, userName: action.payload };
    case 'UPDATE_NAME':
      return { ...state, name: action.payload };
    case 'UPDATE_UNIT':
      return { ...state, unit: action.payload };
    case 'UPDATE_ROLE':
      return { ...state, role: action.payload };
    case 'UPDATE_USER_ID':
      return { ...state, userID: action.payload };
    case 'UPDATE_ACCESS_TOKEN':
      return { ...state, accessToken: action.payload };
    case 'UPDATE_EXPIRES_ON':
      return { ...state, expiresOn: action.payload };
    case 'UPDATE_NOTIFICATION_TEXT':
      return { ...state, notificationText: action.payload };
    case 'UPDATE_CHOICES':
      return { ...state, choices: action.payload };
    case 'UPDATE_CARDS_TO_PRINT':
      return { ...state, cardsToPrint: action.payload };
    case 'UPDATE_IS_ACCELERATOR_LAB':
      return { ...state, isAcceleratorLab: action.payload };
    case 'UPDATE_TREND_FILTERS':
      return { ...state, trendFilters: action.payload };
    case 'UPDATE_SIGNAL_FILTERS':
      return { ...state, signalFilters: action.payload };
    case 'UPDATE_NO_OF_TRENDS_FILTERS_ACTIVE':
      return { ...state, noOfTrendsFiltersActive: action.payload };
    case 'UPDATE_NO_OF_SIGNALS_FILTERS_ACTIVE':
      return { ...state, noOfSignalsFiltersActive: action.payload };
    case 'UPDATE_SIGNALS_SORT_BY':
      return { ...state, signalsSortBy: action.payload };
    case 'UPDATE_TRENDS_SORT_BY':
      return { ...state, trendsSortBy: action.payload };
    case 'UPDATE_TREND_LIST':
      return { ...state, trendList: action.payload };
    case 'UPDATE_SIGNAL_LIST':
      return { ...state, signalList: action.payload };
    default:
      return { ...state };
  }
};
