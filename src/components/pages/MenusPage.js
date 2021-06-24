import { h } from 'preact';
import { connect } from 'redux-bundler-preact';

const MenusPage = ({ menuList }) => (
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Available Menus</h3>
    </div>
    <div>
      <dl>
        {menuList.length > 0 &&
          menuList.map(menu => (
            <a
              href={`/menus/${menu.id}`}
              class="bg-gray-50 px-4 py-5 grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4 sm:px-6"
            >
              <dd class="text-sm leading-5 font-medium text-gray-500">{menu.name}</dd>
              <dt class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {menu.description}
              </dt>
            </a>
          ))}
      </dl>
    </div>
  </div>
);

export default connect('selectMenuList', MenusPage);
