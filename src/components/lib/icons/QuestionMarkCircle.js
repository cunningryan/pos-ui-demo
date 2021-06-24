const QuestionMarkCircle = ({ bgColor = 'bg-blue-100', textColor = 'text-blue-600' }) => (
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
      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </div>
);

export default QuestionMarkCircle;
