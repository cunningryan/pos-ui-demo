import { Fragment } from 'preact';
import Navigation from './views/nav/Navigation';

const Wrapper = ({ title, children, nav }) => (
  <Fragment>
    <Navigation nav={nav} />
    {title && (
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold leading-tight text-gray-900">{title}</h2>
        </div>
      </header>
    )}
    <div class={`max-w-7xl mx-auto sm:px-6 lg:px-8${title ? ' py-6' : ''}`}>{children}</div>
  </Fragment>
);

export default Wrapper;
