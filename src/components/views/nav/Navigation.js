import { useState } from 'preact/hooks';
import { connect } from 'redux-bundler-preact';

import Logo from './Logo';
import Hamburger from './Hamburger';

const Navigation = ({ nav = [], doUserLogout }) => {
  const [showNav, toggleNav] = useState(false);

  return (
    <nav class="bg-red-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center py-2">
            <Logo />
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline w-full">
                {nav.map(link => (
                  <a
                    href={link.url}
                    class="px-3 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:text-white focus:bg-red-800"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div class="hidden md:block items-center py-2">
            <div>
              <button
                onClick={() => doUserLogout()}
                class="self-end px-3 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:text-white focus:bg-red-800"
              >
                Logout
              </button>
            </div>
          </div>
          <div class="-mr-2 flex md:hidden">
            <Hamburger toggle={() => toggleNav(!showNav)} show={showNav} />
          </div>
        </div>
      </div>
      <div class={`${showNav ? 'block ' : 'hidden '} md:hidden`}>
        <div class="px-2 pt-2 pb-3 sm:px-3 bg-red-700">
          {nav.map(item => (
            <a
              href={item.url}
              onClick={() => toggleNav(false)}
              class="block px-3 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:text-white focus:bg-red-800"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => doUserLogout()}
            class="block px-3 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:text-white focus:bg-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default connect('doUserLogout', Navigation);
