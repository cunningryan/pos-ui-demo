import { APPLICATION_ID, buildCallbackUrl, CURRENCY_CODE } from './constants';

const SDK_VERSION = '1.3';
const TENDER_TYPES = ['CREDIT_CARD', 'CASH', 'OTHER', 'SQUARE_GIFT_CARD', 'CARD_ON_FILE'];

export const processTransaction = ({ total, notes, currencyCode = CURRENCY_CODE }) => {
  const dataParameter = {
    amount_money: {
      amount: parseInt(total, 10),
      currency_code: currencyCode,
    },
    callback_url: buildCallbackUrl(),
    client_id: APPLICATION_ID,
    notes,
    options: {
      supported_tender_types: TENDER_TYPES,
    },
    version: SDK_VERSION,
  };

  window.location = `square-commerce-v1://payment/create?data=${encodeURIComponent(
    JSON.stringify(dataParameter),
  )}`;
};

export const openAppStore = () => {
  window.location = 'https://apps.apple.com/us/app/square-point-of-sale-pos/id335393788?mt=8';
};

const errLookup = {
  amount_invalid_format: 'The request had a missing or invalid amount to charge.',
  amount_too_large: 'The request amount to charge was too large.',
  amount_too_small: 'The request amount to charge was too small.',
  client_not_authorized_for_user:
    'Point of Sale versions prior to 4.53 require the developer to guide merchants through OAuth before allowing them to take payments with Point of Sale API. As of Point of Sale 4.53, this error type is deprecated. Read more about Square OAuth.',
  could_not_perform:
    'The request could not be performed. This is usually because there is an unfinished transaction pending in Square Point of Sale. Merchants must open Square Point of Sale and complete the transaction before initiating a new request.',
  currency_code_mismatch:
    'The currency code provided in the request does not match the currency associated with the current business.',
  currency_code_missing: 'The currency code provided in the request is missing or invalid.',
  customer_management_not_supported:
    'This merchant account does not support customer management and therefore cannot associate transactions with customers.',
  data_invalid: 'The URL sent to Square Point of Sale had missing or invalid information.',
  invalid_customer_id:
    "The customer ID provided in the request does not correspond to a customer in the logged in Square merchant's customer directory.",
  invalid_tender_type: 'The request included an invalid tender type.',
  no_network_connection: 'The transaction failed because the device has no network connection.',
  not_logged_in: 'A merchant is not currently logged in to Square Point of Sale.',
  payment_canceled: 'The merchant canceled the payment in Square Point of Sale.',
  unsupported_api_version:
    "The installed version of Square Point of Sale doesn't support the specified version of the Point of Sale API.",
  unsupported_currency_code:
    'The currency code provided in the request is not currently supported in the Point of Sale API.',
  unsupported_tender_type:
    'The request included a tender type that is not currently supported by the Point of Sale API.',
  user_id_mismatch:
    'The business location currently logged in to Square Point of Sale does not match the location represented by the location_id you provided in your request.',
  user_not_active: 'The currently logged in location has not activated card processing.',
};

export const getErrorMessage = errCode => errLookup[errCode];

export const formatQueryData = queryObj => {
  const dataObj = JSON.parse(queryObj.data);
  return dataObj.status === 'ok'
    ? {
        status: 'ok',
        transaction_id: dataObj.transaction_id || 'N/A',
        client_transaction_id: dataObj.client_transaction_id || 'N/A',
      }
    : { status: 'error', error_code: dataObj.error_code };
};
