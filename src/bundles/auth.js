import { createSelector } from 'redux-bundler';

import { doLocalStorage } from '../utils';

const TOKEN_RENEWAL = 300000;

const ActionTypes = {
  // Login Action Types
  AUTH_LOGIN_START: 'AUTH_LOGIN_START',
  AUTH_LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
  AUTH_LOGIN_ERROR: 'AUTH_LOGIN_ERROR',
  AUTH_LOGOUT_SUCCESS: 'AUTH_LOGOUT_SUCCESS',

  // Renew Token
  AUTH_RENEW_START: 'AUTH_RENEW_START',
  AUTH_RENEW_SUCCESS: 'AUTH_RENEW_SUCCESS',
  AUTH_RENEW_ERROR: 'AUTH_RENEW_ERROR',

  // Cleanup
  AUTH_CLEAN_LOGIN_ERROR: 'AUTH_CLEAN_LOGIN_ERROR',
  AUTH_CLEAN_ERROR_MESSAGES: 'AUTH_CLEAN_ERROR_MESSAGES',

  // Password - Reset
  AUTH_REQUEST_PASSWORD_START: 'AUTH_REQUEST_PASSWORD_START',
  AUTH_REQUEST_PASSWORD_SUCCESS: 'AUTH_REQUEST_PASSWORD_SUCCESS',
  AUTH_REQUEST_PASSWORD_ERROR: 'AUTH_REQUEST_PASSWORD_ERROR',
};

export default {
  name: 'auth',
  getReducer: () => {
    const initialState = {
      loading: false,
      isValidUser: false,
      loginToken: doLocalStorage().getItem('loginToken') || null,
      renewToken: doLocalStorage().getItem('renewToken') || null,
      loggedInSince: null,
      tokenRenewedAt: null,
      verificationErrorMessage: null,
      loginErrorMessage: null,
      authData: null,
    };
    return (state = initialState, { type, payload }) => {
      switch (type) {
        // LOGIN REDUCERS
        case ActionTypes.AUTH_LOGIN_START:
          return {
            ...state,
            loading: true,
            loginToken: null,
            loginErrorMessage: null,
            loggedInSince: null,
            tokenRenewedAt: null,
          };
        case ActionTypes.AUTH_LOGIN_SUCCESS:
          return {
            ...state,
            loading: false,
            loginToken: payload.token,
            renewToken: payload.renew_token,
            loginErrorMessage: null,
            loggedInSince: Date.now(),
            tokenRenewedAt: Date.now(),
            isValidUser: true,
          };
        case ActionTypes.AUTH_LOGIN_ERROR:
          return {
            ...state,
            loading: false,
            loggedInSince: null,
            loginToken: null,
            renewToken: null,
            tokenRenewedAt: null,
            loginErrorMessage: payload,
          };
        case ActionTypes.AUTH_LOGOUT_SUCCESS:
          return {
            ...state,
            loading: false,
            loggedInSince: null,
            loginToken: null,
            renewToken: null,
            loginErrorMessage: null,
            tokenRenewedAt: null,
            isValidUser: false,
          };
        case ActionTypes.AUTH_RENEW_START:
          return {
            ...state,
            loading: true,
          };
        case ActionTypes.AUTH_RENEW_SUCCESS:
          return {
            ...state,
            loading: false,
            loginToken: payload.token,
            renewToken: payload.renew_token,
            tokenRenewedAt: Date.now(),
          };
        //  PASSWORD REDUCERS
        case ActionTypes.AUTH_CLEAN_LOGIN_ERROR:
          return { ...state, loginErrorMessage: null };
        case ActionTypes.AUTH_CLEAN_ERROR_MESSAGES:
          return { ...state, loginErrorMessage: null, verificationErrorMessage: null };

        default:
          return state;
      }
    };
  },

  /**
   * Selectors
   */
  selectAuthDataRaw: state => state.auth,
  selectAuthLoading: state => state.auth.loading,
  selectIsValidUser: state => state.auth.isValidUser,
  selectAuthenticationData: state => state.auth.authData,
  selectUserVerificationError: state => state.auth.verificationErrorMessage,
  selectUserLoginError: state => state.auth.loginErrorMessage,
  selectUserLogin: state => state.auth.loginToken,

  /**
   * Action Creators
   */
  /**
   * Log the user in the backend API
   * Expect to return the log in token
   * @param   {string}  email     [email description]
   * @param   {string}  password  [password description]
   *
   * @return  {Promise}            Return the promise if needed
   */
  doUserLogin: ({ email, password }) => ({ dispatch, apiFetch }) => {
    dispatch({ type: ActionTypes.AUTH_LOGIN_START });
    apiFetch({
      method: 'POST',
      endpoint: 'session',
      data: {
        user: { email, password },
      },
    })
      .then(({ data }) => {
        if (data.token) {
          dispatch({ type: ActionTypes.AUTH_LOGIN_SUCCESS, payload: data });
          doLocalStorage().setItem('loginToken', data.token);
          doLocalStorage().setItem('renewToken', data.renew_token);
        }
        if (data.user) {
          dispatch({ actionCreator: 'doUpdateUser', args: [data.user] });
          dispatch({
            actionCreator: 'doUpdateDevice',
            args: [{ deviceStatus: data.user.device_status }],
          });
          if (data.user.role !== 'admin') {
            dispatch({
              actionCreator: 'doUpdateUrl',
              args: [`/pos`],
            });
          } else {
            dispatch({
              actionCreator: 'doUpdateUrl',
              args: [`/menus`],
            });
          }
        }
      })
      .catch(err => {
        console.error('login error', err);
        dispatch({
          type: ActionTypes.AUTH_LOGIN_ERROR,
          payload: err.message,
        });
      });
  },
  doRenewToken: () => ({ dispatch, apiFetch, getState }) => {
    dispatch({ type: ActionTypes.AUTH_RENEW_START });
    apiFetch({
      method: 'POST',
      endpoint: 'session/renew',
      data: {},
      headers: {
        Authorization: getState().auth.renewToken || undefined,
      },
    })
      .then(({ data }) => {
        if (data.token) {
          dispatch({ type: ActionTypes.AUTH_RENEW_SUCCESS, payload: data });
          doLocalStorage().setItem('loginToken', data.token);
          doLocalStorage().setItem('renewToken', data.renew_token);
        }
      })
      .catch(err => {
        console.error('renew token error', err);
        dispatch({
          type: ActionTypes.AUTH_RENEW_ERROR,
          payload: 'Session ended. Please log in again.',
        });
      });
  },

  /**
   * Log the user out
   * by removing login token
   * and removing token stored in session Storage
   */
  doUserLogout: () => ({ dispatch }) => {
    dispatch({ actionCreator: 'doUpdateUrl', args: ['/'] });
    dispatch({ actionCreator: 'doClearUser' });
    dispatch({ actionCreator: 'doClearTransaction' });
    dispatch({ actionCreator: 'doClearMenu' });
    dispatch({ type: ActionTypes.AUTH_LOGOUT_SUCCESS });
    doLocalStorage().removeItem('loginToken');
    doLocalStorage().removeItem('renewToken');
  },

  doCleanAuthErrors: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.AUTH_CLEAN_ERROR_MESSAGES });
  },
  doCleanLoginError: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.AUTH_CLEAN_LOGIN_ERROR });
  },
  reactShouldRenewToken: createSelector(
    'selectAuthDataRaw',
    'selectAppTime',
    (authData, appTime) => {
      if (authData.loading || !authData.renewToken || !authData.tokenRenewedAt) return null;

      if (appTime - authData.tokenRenewedAt > TOKEN_RENEWAL) {
        return { actionCreator: 'doRenewToken' };
      }
    },
  ),
  persistActions: [
    ActionTypes.AUTH_LOGIN_SUCCESS,
    ActionTypes.AUTH_RENEW_SUCCESS,
    ActionTypes.AUTH_LOGOUT_SUCCESS,
  ],
};
