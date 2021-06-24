import { getOSName } from '../platform';
import * as android from './open_pos_android';
import * as ios from './open_pos_ios';

let debugPlatform = false;
try {
  if (window.localStorage.debugPlatform) {
    debugPlatform = window.localStorage.debugPlatform;
    console.warn('Debugging as...', debugPlatform);
  }
} catch (e) {}

const platform = debugPlatform || getOSName();

const platformSwitch = (userPlatform = 'ios') => {
  switch (userPlatform) {
    case 'ios':
      return ios;
    case 'android':
      return android;
    case 'unsupported':
      throw new Error(`Unsupported platform. iOS/Android only`);
    case 'unknown':
      throw new Error(`Unknown platform: ${navigator.platform}`);
    default:
      throw new Error(`Unable to connect to Square reader app`);
  }
};

/**
 * @param {object} args
 * @param {number} args.total - Transaction total as an integer
 * @param {string} [args.notes] - Optional Notes input
 * @param {string} [args.currencyCode=USD] - currency code
 */
export const processSquareTransaction = args => platformSwitch(platform).processTransaction(args);

/**
 * [openAppStore description]
 */
export const openAppStore = () => platformSwitch(platform).openAppStore();

/**
 * @param {object} args
 */
export const formatQueryData = args => platformSwitch(platform).formatQueryData(args);

/**
 * @param {string} errCode - platform-specific error code
 */
export const getErrorMessage = errCode => {
  try {
    return platformSwitch(platform).getErrorMessage(errCode);
  } catch (err) {
    console.error(err);
    return 'Unknown error occurred. No Message available...';
  }
};
