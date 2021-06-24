const CheckCircle = ({ bgColor = 'bg-green-100', textColor = 'text-green-600' }) => (
  <div class={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${bgColor}`}>
    <svg class={`h-6 w-6 ${textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

export default CheckCircle;
