const Modal = ({
  title,
  children,
  icon,
  primaryButtonText,
  secondaryButtonText,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <div class="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div
        class="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div>
          {icon}
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
              {title}
            </h3>
            {children && (
              <div class="mt-2">
                <p class="text-sm leading-5 text-gray-500">{children}</p>
              </div>
            )}
          </div>
        </div>
        {(primaryButtonText || secondaryButtonText) && (
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            {primaryButtonText && (
              <span class="flex w-full rounded-md shadow-sm sm:col-start-2">
                <button
                  type="button"
                  class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  onClick={primaryAction}
                >
                  {primaryButtonText}
                </button>
              </span>
            )}
            {secondaryButtonText && (
              <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:col-start-1">
                <button
                  type="button"
                  class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  onClick={secondaryAction}
                >
                  {secondaryButtonText}
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
