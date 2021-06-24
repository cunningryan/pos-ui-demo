import { createSelector } from 'redux-bundler';
import { uuidv4 } from '../utils';

const ALERT_TIME = 30000;

const ActionTypes = {
  UPDATE: 'ALERTS_UPDATE',
  CLEAR: 'ALERTS_CLEAR',
};

export const AlertLevels = {
  SUCCESS: 'Success',
  INFO: 'Notification',
  WARN: 'Warning',
  ERROR: 'Error',
};

const createDefaultAlert = ({
  msg,
  level = AlertLevels.INFO,
  title,
  id = uuidv4(),
  persist = false,
  timeout = ALERT_TIME,
}) => ({
  id,
  title: title || level,
  msg,
  level,
  createdAt: Date.now(),
  primaryAction: null, // TODO: Holding place for now. We could
  secondaryAction: null, // add buttons for the user to do something
  persist,
  timeout,
});

export default {
  name: 'alerts',
  getReducer: () => {
    const initialState = {
      data: null,
    };

    // Reducer
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case ActionTypes.UPDATE:
          return {
            ...state,
            data: payload,
          };
        case ActionTypes.CLEAR:
          return {
            ...state,
            data: null,
          };
        default:
          return state;
      }
    };
  },

  // Selectors
  selectAlertsRaw: state => state.alerts,
  selectAlertsData: state => state.alerts.data,
  selectAlertsList: createSelector('selectAlertsRaw', alertsData =>
    alertsData.data ? Object.values(alertsData.data) : [],
  ),

  // Action Creators
  doCreateAlert: alertObj => ({ dispatch, getState }) => {
    const newAlert = createDefaultAlert(alertObj);
    dispatch({
      type: ActionTypes.UPDATE,
      payload: {
        ...getState().alerts.data,
        [newAlert.id]: newAlert,
      },
    });
  },
  doClearAlert: id => ({ dispatch, getState }) => {
    const alertData = getState().alerts.data;
    delete alertData[id];
    dispatch({
      type: ActionTypes.UPDATE,
      payload: alertData,
    });
  },
  doClearAlerts: idList => ({ dispatch, getState }) => {
    const alertData = getState().alerts.data;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < idList.length; i++) {
      delete alertData[idList[i]];
    }

    dispatch({
      type: ActionTypes.UPDATE,
      payload: alertData,
    });
  },
  doClearAllAlerts: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.CLEAR });
  },

  // Reactors
  reactShouldClearAlerts: createSelector(
    'selectAppTime',
    'selectAlertsList',
    (appTime, alertsList) => {
      if (!alertsList.length) return null;

      const clearIds = alertsList.reduce((acc, alert) => {
        if (!alert.persist && appTime - alert.createdAt >= alert.timeout) {
          acc.push(alert.id);
        }
        return acc;
      }, []);

      if (clearIds.length) {
        return { actionCreator: 'doClearAlerts', args: [clearIds] };
      }
    },
  ),
};
