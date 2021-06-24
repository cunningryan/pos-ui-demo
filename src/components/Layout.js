import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { connect } from 'redux-bundler-preact';
import { getNavHelper } from 'internal-nav-helper';

import Alerts from './views/Alerts';
import NewDeviceSetup from './views/newDevice/NewDeviceSetup';
import Wrapper from './Wrapper';

const Layout = ({ alertsList, isValidUser, route, userRole, navLinks, deviceNew, doUpdateUrl }) => {
  const Page = route.component;

  useEffect(() => {
    const newTitle = `Demo - ${route.pageTitle || 'POS'}`;
    if (document.title !== newTitle) {
      document.title = newTitle;
    }
  }, [route.pageTitle]);

  return (
    <main id="layout" onClick={getNavHelper(doUpdateUrl)}>
      {route.roles && route.roles.includes(userRole) && isValidUser && (
        <Fragment>
          <Wrapper title={route.title} nav={navLinks}>
            <Page />
          </Wrapper>
          {deviceNew && <NewDeviceSetup />}
        </Fragment>
      )}
      {!route.roles && <Page />}
      <Alerts alertsList={alertsList} />
    </main>
  );
};

export default connect(
  'selectRoute',
  'selectUserRole',
  'selectIsValidUser',
  'selectAlertsList',
  'selectNavLinks',
  'selectDeviceNew',
  'doUpdateUrl',
  Layout,
);
