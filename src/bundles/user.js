const ActionTypes = {
  UPDATE: 'UPDATE_USER',
  CLEAR: 'CLEAR_USER',
};

export const Roles = {
  ADMIN: 'admin',
  USER: 'user',
  DEVICE: 'device',
  NONE: null,
};

export default {
  name: 'user',
  getReducer: () => {
    const initialState = {
      error: null,
      restaurantId: null,
      role: null,
      registrationError: null,
    };

    // Reducer
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case ActionTypes.UPDATE:
          return {
            ...state,
            error: null,
            restaurantId: payload.restaurant.id,
            role: payload.role,
          };
        case ActionTypes.CLEAR:
          return {
            ...state,
            error: null,
            role: null,
            restaurantId: null,
          };
        default:
          return state;
      }
    };
  },

  // Selectors
  selectUserDataRaw: state => state.user,
  selectUserRole: state => state.user.role,
  selectUserRestaurantId: state => state.user.restaurantId,

  // Action Creators
  doUpdateUser: user => ({ dispatch }) => {
    dispatch({ type: ActionTypes.UPDATE, payload: user });
  },
  doClearUser: () => ({ dispatch }) => {
    dispatch({ type: ActionTypes.CLEAR });
  },

  doInviteUser: email => ({ apiFetch, dispatch }) => {
    return apiFetch({
      endpoint: 'invites/new',
      method: 'post',
      data: {
        user: { email },
      },
    })
      .then(() => {
        dispatch({
          actionCreator: 'doCreateAlert',
          args: [
            {
              msg: 'User successfully invited!',
              title: 'Success',
              level: 'Success',
            },
          ],
        });
      })
      .catch(({ errors }) => {
        dispatch({
          actionCreator: 'doCreateAlert',
          args: [
            {
              msg: Object.entries(errors).reduce((acc, [key, value]) => {
                acc += `${key.charAt(0).toUpperCase()}${key
                  .slice(1)
                  .split('_')
                  .join(' ')} ${value}`;
                return acc;
              }, ''),
              level: 'Error',
              title: 'Error',
            },
          ],
        });
      });
  },
  doRegisterUser: (user, inviteId) => ({ apiFetch, dispatch }) => {
    return apiFetch({
      endpoint: `invites/${inviteId}`,
      method: 'post',
      data: {
        user,
      },
    })
      .then(() => {
        dispatch({
          actionCreator: 'doCreateAlert',
          args: [
            {
              msg: 'Account created! You can now log in.',
              title: 'Success!',
              level: 'Success',
            },
          ],
        });
        dispatch({
          actionCreator: 'doUpdateUrl',
          args: ['/'],
        });
      })
      .catch(({ errors }) => {
        if (errors) {
          dispatch({
            actionCreator: 'doCreateAlert',
            args: [
              {
                msg: Object.entries(errors).reduce((acc, [key, value]) => {
                  acc += `${key.charAt(0).toUpperCase()}${key
                    .slice(1)
                    .split('_')
                    .join(' ')} ${value}\n`;
                  return acc;
                }, ''),
                level: 'Error',
                title: 'Error',
              },
            ],
          });
        } else {
          dispatch({
            actionCreator: 'doCreateAlert',
            args: [
              {
                msg: 'Unable to complete registration',
                level: 'Error',
                title: 'Error',
              },
            ],
          });
        }
      });
  },
  doResetUserPassword: (user, resetId) => ({ apiFetch, dispatch }) => {
    return apiFetch({
      endpoint: `reset-password/${resetId}`,
      method: 'post',
      data: {
        user,
      },
    })
      .then(() => {
        dispatch({
          actionCreator: 'doCreateAlert',
          args: [
            {
              msg: 'Your password has been updated! You can now log in.',
              title: 'Success!',
              level: 'Success',
            },
          ],
        });
        dispatch({
          actionCreator: 'doUpdateUrl',
          args: ['/'],
        });
      })
      .catch(({ errors }) => {
        if (errors) {
          dispatch({
            actionCreator: 'doCreateAlert',
            args: [
              {
                msg: Object.entries(errors).reduce((acc, [key, value]) => {
                  acc += `${key.charAt(0).toUpperCase()}${key
                    .slice(1)
                    .split('_')
                    .join(' ')} ${value}`;
                  return acc;
                }, ''),
                level: 'Error',
                title: 'Error',
              },
            ],
          });
        } else {
          dispatch({
            actionCreator: 'doCreateAlert',
            args: [
              {
                msg: 'Unable to update password',
                level: 'Error',
                title: 'Error',
              },
            ],
          });
        }
      });
  },
  doResetPassword: user => ({ apiFetch, dispatch }) => {
    return apiFetch({
      endpoint: `reset-password`,
      method: 'post',
      data: {
        user,
      },
    })
      .then(() => {
        dispatch({
          actionCreator: 'doCreateAlert',
          args: [
            {
              msg: 'If you are registered in our system, you should receive an email shortly.',
              title: 'Success!',
              level: 'Success',
            },
          ],
        });
        dispatch({
          actionCreator: 'doUpdateUrl',
          args: ['/'],
        });
      })
      .catch(({ errors }) => {
        if (errors) {
          dispatch({
            actionCreator: 'doCreateAlert',
            args: [
              {
                msg: Object.entries(errors).reduce((acc, [key, value]) => {
                  acc += `${key.charAt(0).toUpperCase()}${key
                    .slice(1)
                    .split('_')
                    .join(' ')} ${value}`;
                  return acc;
                }, ''),
                level: 'Error',
                title: 'Error',
              },
            ],
          });
        } else {
          dispatch({
            actionCreator: 'doCreateAlert',
            args: [
              {
                msg: 'Unable to reset password',
                level: 'Error',
                title: 'Error',
              },
            ],
          });
        }
      });
  },

  // Reactors

  persistActions: [ActionTypes.UPDATE, ActionTypes.CLEAR],
};
