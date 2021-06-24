import { h } from 'preact';
import { connect } from 'redux-bundler-preact';

import { formatAmount } from '../../utils';

const MenuDetailPage = ({ currentMenu }) =>
  currentMenu && (
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="flex items-center justify-between px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">{currentMenu.name}</h3>
        <a
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href={`/menus/${currentMenu.id}/pos`}
        >
          Open POS
        </a>
      </div>
      <div>
        <dl>
          {currentMenu.items &&
            currentMenu.items.map(menu => (
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dd class="text-sm leading-5 font-medium text-gray-500">{menu.name}</dd>
                <dt class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatAmount(menu.price)}
                </dt>
              </div>
            ))}
        </dl>
      </div>
    </div>
  );

export default connect('selectCurrentMenu', MenuDetailPage);
