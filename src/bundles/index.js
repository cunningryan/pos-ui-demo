import { composeBundles, createCacheBundle } from 'redux-bundler';

import cache from '../utils/cache';

/** Redux bundler stuff and helpers */
import api from './lib/api';
import appIdle from './lib/app-idle';
import routes from './routes';
import nav from './nav';
import onlineBundle from 'redux-bundler/dist/online-bundle';

/** App stuff */
import alerts from './alerts';
import device from './device';
import menu from './menu';
import transaction from './transaction';

/** Users and Auth */
import auth from './auth';
import user from './user';

export default composeBundles(
  appIdle({ idleTimeout: process.env.NODE_ENV === 'production' ? 1000 : 15000 }),
  alerts,
  auth,
  device,
  user,
  menu,
  routes,
  nav,
  onlineBundle,
  transaction,
  createCacheBundle({ cacheFn: cache.set }),
  api,
);
