import { h, Fragment } from 'preact';
import { useReducer, useState, useEffect } from 'preact/hooks';
import { connect } from 'redux-bundler-preact';

import { formatAmount } from '../../utils';

import PosItem from '../views/pos/PosItem';

const DEFAULT_TAX = 0.07;

const actionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  HARD_UPDATE: 'HARD_UPDATE',
};

const initialCart = { items: [], gross: 0.0, tax: 0.0, total: 0.0 };

const cartReducer = (state, { type, payload }) => {
  switch (type) {
    case actionTypes.ADD_ITEM: {
      const newSubtotal = state.gross + payload.price;
      return {
        ...state,
        items: state.items.concat([payload]),
        gross: newSubtotal,
        tax: Math.round(newSubtotal * state.salesTax),
        total: Math.round(newSubtotal * (1 + state.salesTax)),
      };
    }
    case actionTypes.REMOVE_ITEM: {
      const newSubtotal = state.gross - payload.item.price;
      return {
        ...state,
        items: state.items.filter((x, id) => id !== payload.id),
        gross: newSubtotal,
        tax: Math.round(newSubtotal * state.salesTax),
        total: Math.round(newSubtotal * (1 + state.salesTax)),
      };
    }
    case actionTypes.HARD_UPDATE:
      return {
        ...state,
        ...payload,
      };
    case actionTypes.CLEAR_CART:
      return {
        ...state,
        ...initialCart,
      };
    default:
      throw new Error('Unexpected action type');
  }
};

const PointOfSalePage = ({
  currentMenu,
  transactionHandling,
  menuList,
  doCancelTransaction,
  doProcessTransaction,
  doSetDefaultMenu,
}) => {
  console.log('currentMenu', currentMenu);

  const [cart, dispatch] = useReducer(cartReducer, {
    ...initialCart,
  });

  useEffect(() => {
    if (currentMenu) {
      console.log('got menu, updating...', cart);
      dispatch({
        type: actionTypes.HARD_UPDATE,
        payload: {
          ...cart,
          restaurantId: currentMenu.restaurant_id,
          salesTax: isNaN(currentMenu.sales_tax) ? DEFAULT_TAX : +currentMenu.sales_tax,
        },
      });
      console.log('got menu, updating...', cart);
    }
  }, [currentMenu]);

  const [showCart, updateShowCart] = useState(false);
  return (
    <div class="flex flex-col min-h-screen">
      {currentMenu && (
        <Fragment>
          <div class="flex flex-wrap">
            {currentMenu.items &&
              currentMenu.items.map(item => (
                <PosItem
                  item={item}
                  handleClick={() => dispatch({ type: actionTypes.ADD_ITEM, payload: item })}
                />
              ))}
          </div>
          <div class="flex-grow"></div>
          <div class="flex justify-end sticky bottom-0">
            <div class="w-full max-h-5/6 overflow-y-scroll sm:w-2/3 md:w-2/5 text-left shadow-xl sm:rounded-lg">
              <div class="flex justify-between items-center w-full text-left shadow px-4 py-3 sm:py-5 bg-gray-900 border-b border-gray-900 text-gray-100 sticky top-0 z-50 sm:px-6">
                <div>
                  <h3 class="text-lg leading-6 font-medium">Cart</h3>
                  <p class="mt-1 max-w-2xl text-sm leading-5 ">Items: {cart.items.length}</p>
                </div>
                {cart.items.length > 0 && (
                  <button
                    class="text-right border border-gray-300 rounded-lg px-4 py-2"
                    onClick={() => updateShowCart(!showCart)}
                  >
                    {showCart ? 'Hide' : 'Review'}
                  </button>
                )}
              </div>
              {showCart && cart.items.length > 0 && (
                <Fragment>
                  <dl>
                    {cart.items &&
                      cart.items.map((item, id) => (
                        <div
                          key={`cart-item-${id}-${item.name}`}
                          class="bg-gray-50 px-4 py-5 grid grid-cols-4 gap-4 z-0"
                        >
                          <dd class="text-sm leading-5 font-medium text-gray-500 col-span-2">
                            {item.name}
                          </dd>
                          <dt class="mt-1 text-sm leading-5 text-gray-900">
                            {formatAmount(item.price)}
                          </dt>
                          <button
                            class="text-right text-xs font-medium"
                            onClick={() => {
                              dispatch({ type: actionTypes.REMOVE_ITEM, payload: { id, item } });
                              cart.items.length === 1 && updateShowCart(false);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                  </dl>
                  <div class="flex justify-between items-center w-full text-left shadow px-2 py-4 bg-gray-900 border-b border-gray-900 text-gray-100 sticky bottom-0 z-50 sm:px-6">
                    <dl class="text-sm text-right mr-1">
                      <div class="grid grid-cols-2">
                        <dd>Subtotal:</dd>
                        <dt>{formatAmount(cart.gross)}</dt>
                      </div>
                      <div class="grid grid-cols-2">
                        <dd>Tax:</dd>
                        <dt>{formatAmount(cart.tax)}</dt>
                      </div>
                      <div class="grid grid-cols-2">
                        <dd>Total:</dd>
                        <dt>{formatAmount(cart.total)}</dt>
                      </div>
                    </dl>
                    {!transactionHandling && cart.items.length > 0 && (
                      <Fragment>
                        <button
                          class="text-sm border border-gray-300 rounded-lg px-2 py-1"
                          onClick={() => {
                            dispatch({ type: actionTypes.CLEAR_CART });
                            updateShowCart(false);
                          }}
                        >
                          Clear
                        </button>
                        <button
                          class="font-semibold ml-1 border bg-green-600 border-gray-300 rounded-lg px-3 py-3"
                          onClick={() => doProcessTransaction(cart)}
                        >
                          Place Order
                        </button>
                      </Fragment>
                    )}
                    {transactionHandling && (
                      <Fragment>
                        <button
                          class="text-sm border border-gray-300 rounded-lg px-2 py-1"
                          onClick={() => doCancelTransaction()}
                        >
                          Cancel
                        </button>
                        <div class="border bg-red-500 border-gray-300 rounded-lg px-3 py-2">
                          Placing Order
                        </div>
                      </Fragment>
                    )}
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </Fragment>
      )}
      {!currentMenu && menuList.length > 0 && (
        <div class="bg-white mt-4 overflow-hidden shadow rounded-lg">
          <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">No POS Selected</h3>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="mb-4">
              Looks like you don't have a default menu selected for POS use. Would you like to set
              one of these as your default menu?
            </div>
            <div class="">
              {menuList.map(menu => (
                <button
                  type="button"
                  class="inline-flex mb-2 items-center px-4 py-2 border border-gray-300 text-base leading-6 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                  onClick={() => doSetDefaultMenu(menu.id)}
                >
                  {menu.name} – {menu.description}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(
  'selectCurrentMenu',
  'selectTransactionHandling',
  'selectMenuList',
  'doProcessTransaction',
  'doCancelTransaction',
  'doSetDefaultMenu',
  PointOfSalePage,
);
