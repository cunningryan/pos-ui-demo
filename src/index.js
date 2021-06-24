import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import './style';

import getStore from './bundles';
import Root from './components/Root';
import cache from './utils/cache';

export default () => {
  const [storeData, setInitialData] = useState(null);
  useEffect(() => {
    cache.getAll().then(initialData => {
      // if (initialData) {
      //   console.log('Starting with cached data:', initialData);
      // } else {
      //   console.warn('No initialData');
      // }
      setInitialData(initialData);
    });
  }, []);

  return storeData && <Root store={getStore(storeData)} />;
};
