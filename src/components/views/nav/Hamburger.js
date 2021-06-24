export default ({ toggle, show }) => (
  <button
    onClick={toggle}
    class="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-red-800 focus:outline-none focus:bg-red-800 focus:text-white"
  >
    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
      <path
        class={`${show ? 'hidden' : 'inline-flex'}`}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
      <path
        class={`${show ? 'inline-flex' : 'hidden'}`}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);
