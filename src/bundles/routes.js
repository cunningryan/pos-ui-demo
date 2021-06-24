import { createRouteBundle } from 'redux-bundler';

import { Roles } from './user';

import ForgotPasswordPage from '../components/pages/ForgotPasswordPage';
import InvitePage from '../components/pages/InvitePage';
import LoginPage from '../components/pages/LoginPage';
import MenusPage from '../components/pages/MenusPage';
import MenuDetailPage from '../components/pages/MenuDetailPage';
import PointOfSalePage from '../components/pages/PointOfSalePage';
import RegistrationPage from '../components/pages/RegistrationPage';

export default createRouteBundle({
  '/': {
    title: null,
    pageTitle: 'Login',
    mainNav: false,
    component: LoginPage,
  },
  '/menus': {
    title: 'Menus',
    pageTitle: 'Menus',
    mainNav: true,
    roles: [Roles.ADMIN, Roles.USER, Roles.DEVICE],
    component: MenusPage,
  },
  '/menus/:menuId': {
    title: 'Menu',
    pageTitle: 'Menu',
    roles: [Roles.ADMIN, Roles.USER, Roles.DEVICE],
    component: MenuDetailPage,
  },
  '/menus/:menuId/pos': {
    title: null,
    pageTitle: 'Point of Sale',
    roles: [Roles.ADMIN, Roles.USER, Roles.DEVICE],
    component: PointOfSalePage,
  },
  '/pos': {
    title: null,
    pageTitle: 'Point of Sale',
    mainNav: { label: 'POS' },
    roles: [Roles.ADMIN, Roles.USER, Roles.DEVICE],
    component: PointOfSalePage,
  },
  '/invite': {
    title: 'Invite Users',
    pageTitle: 'Invite Users',
    mainNav: { label: 'Invite' },
    roles: [Roles.ADMIN, Roles.USER],
    component: InvitePage,
  },
  '/invitations/:inviteId/edit': {
    title: 'Registration',
    pageTitle: 'Registration',
    mainNav: false,
    component: RegistrationPage,
  },
  '/forgot-password': {
    title: 'Forgot Password',
    pageTitle: 'Forgot Password',
    mainNav: false,
    component: ForgotPasswordPage,
  },
  '/reset-password/:resetId/edit': {
    title: 'Forgot Password',
    pageTitle: 'Forgot Password',
    mainNav: false,
    component: RegistrationPage,
  },
  '*': {
    title: 'Page Not Found',
    pageTitle: 'Page Not Found',
    component: () => <h1>Page not found!</h1>,
  },
});
