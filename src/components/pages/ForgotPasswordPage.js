import { useRef } from 'preact/hooks';
import { connect } from 'redux-bundler-preact';

import demoPng from '../../assets/demo.png';

const ForgotPasswordPage = ({ doResetPassword }) => {
  const email = useRef(null);

  return (
    <div class="h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div>
          <picture>
            <source srcset={demoPng} type="image/png" alt="Demo Logo" />
            <img src={demoPng} alt="Demo Logo" />
          </picture>
          <h2 class="mt-6 text-center text-2xl leading-9 text-gray-900">Forgot your password?</h2>
          <p class="mt-0 text-center text-md text-gray-600">
            Submit it below and we'll send you an email to reset it.
          </p>
        </div>
        <form
          class="mt-8"
          onSubmit={e => {
            e.preventDefault();
            return doResetPassword({
              email: email.current.value,
            });
          }}
        >
          <input type="hidden" name="remember" value="true" />
          <div class="rounded-md shadow-sm">
            <div>
              <input
                aria-label="Email address"
                name="email"
                type="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                placeholder="Email address"
                ref={email}
              />
            </div>
          </div>
          <div class="mt-8">
            <button
              type="submit"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition duration-150 ease-in-out"
            >
              <span class="absolute left-0 inset-y pl-3">
                <svg
                  class="h-5 w-5 text-red-500 group-hover:text-red-400 transition ease-in-out duration-150"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              Submit
            </button>
          </div>
          <div class="text-sm text-center mt-3 leading-5">
            <a
              href="/"
              class="font-medium text-red-600 hover:text-red-500 focus:outline-none focus:underline transition ease-in-out duration-150"
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
export default connect('doResetPassword', ForgotPasswordPage);
