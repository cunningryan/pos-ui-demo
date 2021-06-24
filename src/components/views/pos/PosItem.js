import { formatAmount } from '../../../utils';

export default ({ item, handleClick }) => (
  <button
    class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-300"
    onClick={handleClick}
  >
    <div class="px-4 py-4 sm:px-6 text-left">
      <h3 class="text-md leading-6 font-medium text-gray-900">{item.name}</h3>
      <p class="mt-1 max-w-2xl text-sm leading-5 text-gray-500">{formatAmount(item.price)}</p>
    </div>
  </button>
);
