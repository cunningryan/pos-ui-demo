const ExclamationCircle = ({ bgColor = 'bg-yellow-100', textColor = 'text-yellow-600' }) => (
  <div class={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${bgColor}`}>
    <svg
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class={`h-6 w-6 ${textColor}`}
    >
      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </div>
);

export default ExclamationCircle;
