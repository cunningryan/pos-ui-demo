import { useRef, useState } from 'preact/hooks';
import { connect } from 'redux-bundler-preact';

// const validEmail = /(?[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?[a-z0-9-]*[a-z0-9])?|\[(?(?25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const InvitePage = ({ doInviteUser }) => {
  const [errors, setErrors] = useState(false);
  const input = useRef(null);

  return (
    <div class="bg-white overflow-hidden shadow rounded-lg mt-8">
      <div class="px-4 py-5 sm:p-6">
        <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={e => {
              e.preventDefault();
              doInviteUser(input.current.value).then(() => {
                input.current.value = '';
              });
            }}
          >
            <label for="email" class="block text-sm font-medium leading-5 text-gray-700">
              Email
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                id="email"
                ref={input}
                placeholder="you@example.com"
                aria-describedby="email-description"
                type="email"
                //   pattern=""
                class={`form-input block w-full sm:text-sm sm:leading-5 ${errors &&
                  'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red'}`}
                onInput={e => {
                  if (errors) {
                    setErrors(false);
                  }
                }}
              />
            </div>
            <p class="mt-2 text-sm text-gray-500" id="email-description">
              We'll send an email to get them set up in our system.
            </p>
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
                Send Invite
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default connect('doInviteUser', InvitePage);
