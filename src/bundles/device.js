import { doLocalStorage } from '../utils';

const ActionTypes = {
  UPDATE: 'UPDATE_DEVICE',
  UPDATE_STATUS: 'UPDATE_DEVICE_STATUS',
  CLEAR: 'CLEAR_DEVICE',
};

const Status = {
  NEW: 'new',
  SETUP_REQUESTED: 'setup_requested',
  SETUP_READY: 'setup_ready',
  NOT_AUTHORIZED: 'not_authorized',
  AUTHORIZED: 'authorized',
  ERRORED: 'errored',
};

export default {
  name: 'device',
  getReducer: () => {
    const initialState = {
      error: null,
      deviceId: null,
      deviceStatus: doLocalStorage().getItem('deviceStatus') || Status.NEW,
    };

    // Reducer
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case ActionTypes.UPDATE:
          return {
            ...state,
            deviceId: payload.deviceId,
            deviceStatus: payload.deviceStatus,
          };
        case ActionTypes.UPDATE_STATUS:
          return {
            ...state,
            deviceStatus: payload,
          };
        case ActionTypes.CLEAR:
          return {
            ...state,
            error: null,
            deviceId: null,
            deviceStatus: Status.NEW,
          };
        default:
          return state;
      }
    };
  },

  // Selectors
  selectDeviceDataRaw: state => state.device,
  selectDeviceNew: state => state.device.deviceStatus === Status.NEW,

  // Action Creators
  doUpdateDevice: device => ({ dispatch }) => {
    dispatch({ type: ActionTypes.UPDATE, payload: device });
  },
  doClearDevice: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.CLEAR });
    doLocalStorage().removeItem('deviceStatus');
  },
  doSetDeviceStatusError: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.UPDATE_STATUS, payload: Status.ERRORED });
  },
  doSetDeviceStatusNotAuthorized: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.UPDATE_STATUS, payload: Status.NOT_AUTHORIZED });
  },
  doSetDeviceStatusAuthorized: () => ({ apiFetch, dispatch }) => {
    dispatch({ type: ActionTypes.UPDATE_STATUS, payload: Status.AUTHORIZED });
    doLocalStorage().setItem('deviceStatus', Status.AUTHORIZED);

    return apiFetch({
      endpoint: 'users',
      method: 'post',
      data: {
        device: { device_status: Status.AUTHORIZED },
      },
    });
  },
  doRequestDeviceCode: number => ({ apiFetch }) => {
    return apiFetch({
      endpoint: 'devices/new',
      method: 'post',
      data: {
        device: { number },
      },
    });
  },

  // Reactors

  persistActions: [ActionTypes.UPDATE, ActionTypes.UPDATE_STATUS, ActionTypes.CLEAR],
};
