import { h } from 'preact';
import { Provider } from 'redux-bundler-preact';
import Layout from './Layout';

export default ({ store }) => (
  <Provider store={store}>
    <Layout />
  </Provider>
);
