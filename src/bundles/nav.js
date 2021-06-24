import { createSelector } from 'redux-bundler';

export default {
  name: 'nav',
  selectNavLinks: createSelector('selectUserRole', 'selectRoutes', (userRole, routes) => {
    if (routes) {
      return Object.keys(routes).reduce((acc, route) => {
        const routeInfo = routes[route].value;
        if (
          routeInfo.mainNav &&
          ((routeInfo.roles && routeInfo.roles.includes(userRole)) || !routeInfo.roles)
        ) {
          acc.push({
            url: route,
            label: routeInfo.mainNav.label || routeInfo.title,
            icon: routeInfo.mainNav.icon || routeInfo.icon,
            ...routeInfo.mainNav,
          });
        }
        return acc;
      }, []);
    }
  }),
};
