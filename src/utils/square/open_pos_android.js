import { APPLICATION_ID, buildCallbackUrl, CURRENCY_CODE } from './constants';

const SDK_VERSION = 'v2.0';
const TENDER_TYPES = [
  'com.squareup.pos.TENDER_CARD',
  'com.squareup.pos.TENDER_CARD_ON_FILE',
  'com.squareup.pos.TENDER_CASH',
  'com.squareup.pos.TENDER_OTHER',
];

export const processTransaction = ({ total, currencyCode = CURRENCY_CODE }) => {
  const posUrl = `intent:#Intent;\
action=com.squareup.pos.action.CHARGE;\
package=com.squareup;\
S.com.squareup.pos.WEB_CALLBACK_URI=${buildCallbackUrl()};\
S.com.squareup.pos.CLIENT_ID=${APPLICATION_ID};\
S.com.squareup.pos.API_VERSION=${SDK_VERSION};\
i.com.squareup.pos.TOTAL_AMOUNT=${total};\
S.com.squareup.pos.CURRENCY_CODE=${currencyCode};\
S.com.squareup.pos.TENDER_TYPES=${TENDER_TYPES.join(',')};\
end`;

  window.open(posUrl);
};

export const openAppStore = () => {
  window.open('https://play.google.com/store/apps/details?id=com.squareup');
};

const errLookup = {
  'com.squareup.pos.ERROR_CUSTOMER_MANAGEMENT_NOT_SUPPORTED':
    'The Square account used does not support Customer Management.',
  'com.squareup.pos.ERROR_DISABLED': 'The Point of Sale API is not currently available.',
  'com.squareup.pos.ERROR_ILLEGAL_LOCATION_ID':
    'The provided location ID does not correspond to the location currently logged in to Square Point of Sale.',
  'com.squareup.pos.ERROR_INVALID_CUSTOMER_ID': 'The provided customer ID is invalid.',
  'com.squareup.pos.ERROR_INVALID_REQUEST':
    'The information provided in this transaction request is invalid (e.g., a required field is missing or malformed).',
  'com.squareup.pos.ERROR_NO_EMPLOYEE_LOGGED_IN':
    'Employee management is enabled but no employee is logged in to Square Point of Sale.',
  'com.squareup.pos.ERROR_NO_NETWORK':
    'Square Point of Sale was unable to validate the Point of Sale API request because the Android device did not have an active network connection.',
  'com.squareup.pos.ERROR_NO_RESULT': 'Square Point of Sale did not return a transaction result.',
  'com.squareup.pos.ERROR_TRANSACTION_ALREADY_IN_PROGRESS':
    'Another Square Point of Sale transaction is already in progress.',
  'com.squareup.pos.ERROR_TRANSACTION_CANCELED':
    'Transaction was canceled in Square Point of Sale.',
  'com.squareup.pos.ERROR_UNAUTHORIZED_CLIENT_ID':
    'The application with the provided client ID is not authorized to use the Point of Sale API.',
  'com.squareup.pos.ERROR_UNEXPECTED': 'An unexpected error occurs.',
  'com.squareup.pos.ERROR_UNSUPPORTED_API_VERSION':
    'The installed version of Square Point of Sale does not support this version of the Point of Sale SDK.',
  'com.squareup.pos.ERROR_UNSUPPORTED_WEB_API_VERSION':
    'The Web API used is not supported in the supplied API version (must be >= v1.3).',
  'com.squareup.pos.ERROR_USER_NOT_ACTIVATED':
    'The Square Point of Sale tried to process a credit card transaction, but the associated Square account is not activated for card processing.',
  'com.squareup.pos.ERROR_USER_NOT_LOGGED_IN':
    'No user is currently logged in to Square Point of Sale.',
};

export const getErrorMessage = errCode => errLookup[errCode];

export const formatQueryData = queryObj =>
  queryObj['com.squareup.pos.ERROR_CODE']
    ? {
        status: 'error',
        error_code: queryObj['com.squareup.pos.ERROR_CODE'],
        meta: queryObj['com.squareup.pos.REQUEST_METADATA'],
      }
    : {
        status: 'ok',
        transaction_id: queryObj['com.squareup.pos.SERVER_TRANSACTION_ID'] || 'N/A',
        client_transaction_id: queryObj['com.squareup.pos.CLIENT_TRANSACTION_ID'] || 'N/A',
        meta: queryObj['com.squareup.pos.REQUEST_METADATA'],
      };
