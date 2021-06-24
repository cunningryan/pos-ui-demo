import { createSelector } from 'redux-bundler';
import { processSquareTransaction, getErrorMessage, formatQueryData } from '../utils/square';
import { AlertLevels } from './alerts';

const RETRY_TIME = 5000;

const ActionTypes = {
  START_HANDLE: 'TRANSACTION_START_HANDLE',
  CANCEL_HANDLE: 'TRANSACTION_CANCEL_HANDLE',
  STOP_HANDLE: 'TRANSACTION_STOP_HANDLE',
  POST: 'TRANSACTION_POST',
  ERROR: 'TRANSACTION_ERROR',
  SUCCESS: 'TRANSACTION_SUCCESS',
  CLEAR: 'TRANSACTION_CLEAR',
  CLEAR_HISTORY: 'TRANSACTION_CLEAR_HISTORY',
  UPDATE_HISTORY: 'TRANSACTION_UPDATE_HISTORY',
  FAILED: 'TRANSACTION_FAILED',
  UPDATE_RETRY: 'TRANSACTION_UPDATE_RETRY',
};

const TxStatusTypes = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  ERRORED: 'ERRORED',
  UNKNOWN: 'UNKNOWN',
};

export default {
  name: 'transaction',
  getReducer: () => {
    const initialState = {
      loading: false,
      handling: false,
      lastError: null,
      lastFetch: null,
      current: null,
      error: null,
      history: [],
      retry: [],
      retryTime: RETRY_TIME,
    };

    // Reducer
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case ActionTypes.START_HANDLE:
          return {
            ...state,
            loading: false,
            handling: true,
            current: payload,
          };
        case ActionTypes.CANCEL_HANDLE:
          return {
            ...state,
            loading: false,
            handling: false,
            current: null,
          };
        case ActionTypes.STOP_HANDLE:
          return {
            ...state,
            loading: true,
            handling: false,
          };
        case ActionTypes.POST:
          return {
            ...state,
            loading: true,
          };
        case ActionTypes.ERROR:
          return {
            ...state,
            lastError: Date.now(),
            loading: false,
            handling: false,
            current: null,
            error: payload,
          };
        case ActionTypes.SUCCESS: {
          const { id, transaction } = payload;
          return {
            ...state,
            lastFetch: Date.now(),
            loading: false,
            lastError: null,
            error: null,
            current: null,
            history: state.history.concat({
              timestamp: Date.now(),
              status: TxStatusTypes.SUCCESS,
              transaction: {
                id,
                ...transaction,
              },
            }),
          };
        }
        case ActionTypes.UPDATE_HISTORY:
          return {
            ...state,
            history: payload,
          };
        case ActionTypes.CLEAR_HISTORY:
          return {
            ...state,
            history: [],
          };
        case ActionTypes.FAILED: {
          const {
            transaction,
            retry = {
              attempts: 0,
            },
          } = payload;
          return {
            ...state,
            current: null,
            retry: state.retry.concat({
              timestamp: Date.now(),
              status: TxStatusTypes.FAILED,
              attempts: retry.attempts + 1,
              transaction,
            }),
          };
        }
        case ActionTypes.UPDATE_RETRY:
          return {
            ...state,
            retry: payload,
          };
        case ActionTypes.CLEAR:
          return {
            ...state,
            lastFetch: null,
            loading: false,
            handling: false,
            lastError: null,
            error: null,
            current: null,
            history: [],
          };
        default:
          return state;
      }
    };
  },

  persistActions: [
    ActionTypes.START_HANDLE,
    ActionTypes.CANCEL_HANDLE,
    ActionTypes.STOP_HANDLE,
    ActionTypes.SUCCESS,
    ActionTypes.ERROR,
    ActionTypes.FAILED,
    ActionTypes.POST,
    ActionTypes.CLEAR,
    ActionTypes.CLEAR_HISTORY,
    ActionTypes.UPDATE_HISTORY,
    ActionTypes.UPDATE_RETRY,
    ActionTypes.RETRY_FAILED,
  ],

  // Selectors
  selectTransactionDataRaw: state => state.transaction,
  selectTransactionHandling: state => state.transaction.handling,
  selectCurrentTransaction: state => state.transaction.current,

  // Action Creators
  doProcessTransaction: payload => ({ dispatch }) => {
    dispatch({ type: ActionTypes.START_HANDLE, payload });
    try {
      processSquareTransaction({
        total: payload.total,
      });
    } catch (err) {
      dispatch({
        actionCreator: 'doCreateAlert',
        args: [
          {
            msg: err.message,
            title: 'Transaction Error!',
            level: AlertLevels.ERROR,
          },
        ],
      });
      dispatch({ type: ActionTypes.ERROR, payload: err.message });
    }
  },
  doCancelTransaction: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.CANCEL_HANDLE });
  },
  /**
   * @function doHandleTransaction
   * Handle the transaction after we receive the callback from Square
   * - Update the URL
   * - Grab the "current" transaction from the store
   * - if we're online, dispatch 'doPostTransactionDetails'
   * - if we're offline, dispatch the FAILED action
   *
   * @param {object} txData
   * @param {string} route
   */
  doHandleTransaction: (txData, route) => ({ dispatch, getState }) => {
    dispatch({ type: ActionTypes.STOP_HANDLE });
    dispatch({ actionCreator: 'doUpdateUrl', args: [route] });
    const { gross, tax, total, items, restaurantId } = getState().transaction.current;
    const transaction = {
      ...txData,
      gross,
      tax,
      total,
      restaurant_id: restaurantId,
      transaction_items: items,
    };

    if (getState().online) {
      dispatch({
        actionCreator: 'doPostTransactionDetails',
        args: [transaction],
      });
    } else {
      dispatch({
        type: ActionTypes.FAILED,
        payload: { transaction },
      });
    }
  },
  /**
   * @function doPostTransactionDetails
   * Post transaction details to Demo cloud
   *  - on fail, dispatch FAILED action with retry (if included)
   *
   * @param {object} transaction
   * @param {object} [retry]
   */
  doPostTransactionDetails: (transaction, retry) => ({ apiFetch, dispatch }) => {
    dispatch({ type: ActionTypes.POST });
    apiFetch({
      endpoint: 'transactions',
      method: 'post',
      data: {
        transaction,
      },
    })
      .then(({ data: { id } }) => {
        dispatch({
          type: ActionTypes.SUCCESS,
          payload: {
            id,
            transaction,
          },
        });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.ERROR, payload: error });
        dispatch({
          type: ActionTypes.FAILED,
          payload: { transaction, retry },
        });
      });
  },
  /**
   * @function doRetrySingleTransaction
   * 1. Grab the first element of the retries list
   * 2. Update state to remove it
   * 3. Dispatch `doPostTransactionDetails`
   */
  doRetrySingleTransaction: () => ({ dispatch, getState }) => {
    const retriesArr = Array.from(getState().transaction.retry);
    const { transaction, ...retry } = retriesArr.shift();
    dispatch({
      type: ActionTypes.UPDATE_RETRY,
      payload: retriesArr,
    });

    dispatch({
      actionCreator: 'doPostTransactionDetails',
      args: [transaction, retry],
    });
  },
  doHandleTransactionSquareError: (alertObj, route) => ({ dispatch }) => {
    dispatch({ actionCreator: 'doUpdateUrl', args: [route] });
    dispatch({ type: ActionTypes.ERROR, payload: alertObj });
    dispatch({ actionCreator: 'doCreateAlert', args: [alertObj] });
  },
  doClearTransaction: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.CLEAR });
  },
  doClearTransactionHistory: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.CLEAR_HISTORY });
  },

  // Reactors
  /*
   * Square response - iOS
   * data: {
   *   status: 'ok',
   *   transaction_id: 'PFcRQuLreqHBnZe6ljzx05eV',
   *   client_transaction_id: '7FE90947-2E98-4134-8FCD-79CA6AC7523A',
   * }
   *
   * Test link:
   * http://localhost:54264/menus/1/pos?data=%7B%22status%22:%22ok%22,%22transaction_id%22:%22gPFcRQuLreqHBnZe6Ijzx05eV%22,%22client_transaction_id%22:%227FE90947-2E98-4134-8FCD-79CA6AC7523A%22%7D
   *
   * Square response - Android
   * cash/offline: com.squareup.pos.CLIENT_TRANSACTION_ID=87bb120d-0666-4844-819b-e0dc39352430
   * normal: com.squareup.pos.CLIENT_TRANSACTION_ID=12aea270-47de-4a92-9786-07b3e92423c0&com.squareup.pos.SERVER_TRANSACTION_ID=ED0l0bDKTS36ksTYe462OA4eV
   *
   * Test link:
   * http://localhost:53314/menus/1/pos?com.squareup.pos.CLIENT_TRANSACTION_ID=12aea270-47de-4a92-9786-07b3e92423c0&com.squareup.pos.SERVER_TRANSACTION_ID=ED0l0bDKTS36ksTYe462OA4eV
   *
   *
   * Square error
   * data: {
   *   error_code: 'amount_invalid_format',
   *   status: 'error'
   * }
   * Test Link:
   * http://localhost:8080/menus/1/pos?data=%7B%22status%22:%22error%22,%22error_code%22:%22amount_invalid_format%22%7D
   *
   */
  reactShouldPostTransaction: createSelector(
    'selectTransactionDataRaw',
    'selectQueryObject',
    'selectUrlObject',
    (txData, queryObj, urlObj) => {
      if (txData.loading || Object.keys(queryObj).length === 0) return null;

      try {
        const data = formatQueryData(queryObj);

        if (data.status === 'ok') {
          return {
            actionCreator: 'doHandleTransaction',
            args: [data, urlObj.pathname],
          };
        } else {
          return {
            actionCreator: 'doHandleTransactionSquareError',
            args: [
              {
                title: 'Transaction Error',
                msg: getErrorMessage(data.error_code),
                level: AlertLevels.ERROR,
              },
              urlObj.pathname,
            ],
          };
        }
      } catch (err) {
        console.warn(err);
        return {
          actionCreator: 'doHandleTransactionSquareError',
          args: [
            {
              title: 'Transaction Error',
              msg: err.message,
              level: AlertLevels.ERROR,
            },
            urlObj.pathname,
          ],
        };
      }
    },
  ),
  reactShouldRetryFailedTransactions: createSelector(
    'selectTransactionDataRaw',
    'selectIsOnline',
    (txData, isOnline) => {
      if (txData.loading || !isOnline || txData.retry.length === 0) return null;

      const sinceError = Date.now() - txData.retry[0].timestamp;

      if (sinceError > txData.retryTime) {
        return {
          actionCreator: 'doRetrySingleTransaction',
          args: [],
        };
      }
    },
  ),
};
