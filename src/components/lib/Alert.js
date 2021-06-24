import { AlertLevels } from '../../bundles/alerts';

const alertColor = {
  [AlertLevels.SUCCESS]: ['bg-green-500', 'bg-green-100'],
  [AlertLevels.INFO]: ['bg-blue-500', 'bg-blue-100'],
  [AlertLevels.WARN]: ['bg-yellow-500', 'bg-yellow-100'],
  [AlertLevels.ERROR]: ['bg-red-500', 'bg-red-100'],
};

export default ({ msg, title, level = AlertLevels.INFO, id }) => (
  <div role="alert">
    {title && (
      <div
        class={`flex justify-between items-center ${alertColor[level][0]} text-white font-bold rounded-t px-4 py-2`}
      >
        <h3 class="mr-4">{title}</h3>
        {/* <span onClick={() => doClearAlert(alert.id)}> */}
        <span>
          <svg
            class="fill-current h-6 w-6 text-white"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    )}
    <div
      class={`border whitespace-pre-line ${title ? 'border-t-0 rounded-b' : 'rounded'} ${
        alertColor[level][1]
      } px-4 py-3 text-black`}
    >
      <p>{msg}</p>
    </div>
  </div>
);
