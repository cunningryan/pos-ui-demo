import { createSelector } from 'redux-bundler';

const ROLE_ACCESS = ['admin'];
const ERROR_TIME = 15000;
const REFRESH_TIME = 300000;
const ActionTypes = {
  FETCH_START: 'FETCH_MENU_START',
  FETCH_ERROR: 'FETCH_MENU_ERROR',
  FETCH_SUCCESS: 'FETCH_MENU_SUCCESS',
  SET_DEFAULT: 'SET_DEFAULT_MENU',
  CLEAR: 'CLEAR_MENU',
};

export default {
  name: 'menu',
  getReducer: () => {
    const initialState = {
      loading: false,
      lastError: null,
      lastFetch: null,
      defaultId: null,
      data: null,
      error: null,
    };

    // Reducer
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case ActionTypes.FETCH_START:
          return {
            ...state,
            loading: true,
          };
        case ActionTypes.FETCH_ERROR:
          return {
            ...state,
            lastError: Date.now(),
            loading: false,
            error: payload,
          };
        case ActionTypes.FETCH_SUCCESS:
          return {
            ...state,
            lastFetch: Date.now(),
            loading: false,
            lastError: null,
            error: null,
            data: payload,
          };
        case ActionTypes.SET_DEFAULT:
          return {
            ...state,
            defaultId: payload,
          };
        case ActionTypes.CLEAR:
          return {
            ...state,
            lastFetch: Date.now(),
            loading: false,
            lastError: null,
            defaultId: null,
            error: null,
            data: null,
          };
        default:
          return state;
      }
    };
  },

  // Selectors
  selectMenuDataRaw: state => state.menu,
  selectMenuData: state => state.menu.data,
  selectMenuList: createSelector('selectMenuDataRaw', menuData =>
    menuData.data ? Object.values(menuData.data) : [],
  ),
  selectCurrentMenu: createSelector(
    'selectMenuDataRaw',
    'selectRouteParams',
    'selectRouteInfo',
    (menuData, routeParams, routeInfo) => {
      if (!menuData.data) return null;
      if (routeParams.menuId) return menuData.data[routeParams.menuId];
      if (routeInfo.url === '/pos') return menuData.data[menuData.defaultId];
    },
  ),
  selectMenuErrorMessage: createSelector('selectMenuDataRaw', menuDataRaw =>
    menuDataRaw.error && menuDataRaw.error.message ? menuDataRaw.error.message : null,
  ),

  // Action Creators
  doFetchMenuList: () => ({ dispatch, apiFetch, getState }) => {
    const restaurantId = getState().user.restaurantId;
    dispatch({ type: ActionTypes.FETCH_START });
    apiFetch({
      endpoint: restaurantId ? `restaurants/${restaurantId}/menus` : 'menus',
    })
      .then(payload => {
        dispatch({
          type: ActionTypes.FETCH_SUCCESS,
          payload: payload.results.reduce((acc, menu) => {
            acc[menu.id] = menu;
            return acc;
          }, {}),
        });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.FETCH_ERROR, payload: error });
      });
  },
  doFetchDefaultMenu: () => ({ dispatch, apiFetch, getState }) => {
    const restaurantId = getState().user.restaurantId;
    dispatch({ type: ActionTypes.FETCH_START });
    apiFetch({
      endpoint: `restaurants/${restaurantId}`,
    })
      .then(payload => {
        const menuData = getState().menu.data;
        const {
          menu: { id },
        } = payload;
        dispatch({ type: ActionTypes.SET_DEFAULT, payload: id });
        dispatch({
          type: ActionTypes.FETCH_SUCCESS,
          payload: {
            ...menuData,
            [id]: payload.menu,
          },
        });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.FETCH_ERROR, payload: error });
      });
  },
  doFetchMenuDetails: menuId => ({ dispatch, apiFetch, getState }) => {
    dispatch({ type: ActionTypes.FETCH_START });
    apiFetch({
      endpoint: `menus/${menuId}`,
    })
      .then(payload => {
        const menuData = getState().menu.data;
        dispatch({
          type: ActionTypes.FETCH_SUCCESS,
          payload: {
            ...menuData,
            [menuId]: payload,
          },
        });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.FETCH_ERROR, payload: error });
      });
  },
  doSetDefaultMenu: payload => ({ dispatch }) => {
    dispatch({ type: ActionTypes.SET_DEFAULT, payload });
  },
  doClearMenu: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.CLEAR });
  },

  // Reactors
  reactShouldFetchMenuData: createSelector(
    'selectMenuDataRaw',
    'selectAppTime',
    'selectIsValidUser',
    'selectUserRole',
    (menuData, appTime, isValidUser, userRole) => {
      if (!isValidUser || menuData.loading || !ROLE_ACCESS.includes(userRole)) {
        return null;
      }

      let shouldFetch = false;

      if (!menuData.data && !menuData.lastError) {
        shouldFetch = true;
      } else if (menuData.lastError) {
        const timePassed = appTime - menuData.lastError;
        if (timePassed > ERROR_TIME) {
          shouldFetch = true;
        }
      } else if (menuData.lastFetch) {
        const timePassed = appTime - menuData.lastFetch;
        if (timePassed > REFRESH_TIME) {
          shouldFetch = true;
        }
      }

      if (shouldFetch) {
        return { actionCreator: 'doFetchMenuList' };
      }
    },
  ),
  reactShouldFetchAdminMenuDetailsData: createSelector(
    'selectMenuDataRaw',
    'selectRouteParams',
    'selectAppTime',
    'selectIsValidUser',
    'selectUserRole',
    (menuData, routeParams, appTime, isValidUser, userRole) => {
      if (!isValidUser || menuData.loading || !ROLE_ACCESS.includes(userRole)) {
        return null;
      }

      let shouldFetch = false;

      if (
        (!menuData.data && !menuData.lastError) ||
        (menuData.data &&
          routeParams.menuId &&
          !menuData.data[routeParams.menuId] &&
          !menuData.lastError) ||
        (menuData.data &&
          menuData.data[routeParams.menuId] &&
          !menuData.data[routeParams.menuId].items) ||
        (menuData.data &&
          menuData.defaultId &&
          menuData.data[menuData.defaultId] &&
          !menuData.data[menuData.defaultId].items)
      ) {
        shouldFetch = true;
      } else if (menuData.lastError) {
        const timePassed = appTime - menuData.lastError;
        if (timePassed > ERROR_TIME) {
          shouldFetch = true;
        }
      } else if (menuData.lastFetch) {
        const timePassed = appTime - menuData.lastFetch;
        if (timePassed > REFRESH_TIME) {
          shouldFetch = true;
        }
      }

      if (shouldFetch) {
        return {
          actionCreator: 'doFetchMenuDetails',
          args: [routeParams.menuId || menuData.defaultId],
        };
      }
    },
  ),
  reactShouldFetchMenuDetailsData: createSelector(
    'selectMenuDataRaw',
    'selectAppTime',
    'selectRouteInfo',
    'selectIsValidUser',
    'selectUserRole',
    (menuData, appTime, routeInfo, isValidUser, userRole) => {
      if (!isValidUser || menuData.loading || !['/menus', '/pos'].includes(routeInfo.url)) {
        return null;
      }

      let shouldFetch = false;

      if (!menuData.data && !menuData.lastError) {
        shouldFetch = true;
      } else if (menuData.lastError) {
        const timePassed = appTime - menuData.lastError;
        if (timePassed > ERROR_TIME) {
          shouldFetch = true;
        }
      } else if (menuData.lastFetch) {
        const timePassed = appTime - menuData.lastFetch;
        if (timePassed > REFRESH_TIME) {
          shouldFetch = true;
        }
      }

      if (shouldFetch) {
        if (userRole === 'admin') return { actionCreator: 'doFetchMenuList' };
        else return { actionCreator: 'doFetchDefaultMenu', args: [] };
      }
    },
  ),
  persistActions: [
    ActionTypes.FETCH_START,
    ActionTypes.FETCH_ERROR,
    ActionTypes.FETCH_SUCCESS,
    ActionTypes.SET_DEFAULT,
    ActionTypes.CLEAR,
  ],
};
