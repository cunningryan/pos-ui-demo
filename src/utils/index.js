export const getApproxTime = time => Math.max(0, Math.round(time));

export const isNumber = value => !Number.isNaN(parseInt(value, 10));

export const searchIdFromOptions = (options, value) => {
  let isTheValueFound = false;
  if (!isNumber(value)) {
    options.forEach(op => {
      if (op.name === value) {
        isTheValueFound = true;
      }
    });
    if (!isTheValueFound) {
      return value;
    }
    const [{ id }] = options.filter(op => op.name === value);
    return id;
  }
  return value;
};

export const uuidv4 = (a, b) => {
  for (
    b = a = '';
    a++ < 36;
    b +=
      ~a % 5 | ((a * 3) & 4)
        ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16)
        : '-'
  );
  return b;
};

/**
 * Build the response object from server in a standar way
 * to have message, statusCode, errors (if any) properties
 * @param {object} err   Axios err.response object
 * @return {object}
 */
export const getApiError = err => {
  const {
    data: { errors },
    status,
  } = err;

  return { statusCode: status, errors };
};

export const getChunkArray = (array, size) => {
  const chunked = [];
  let index = 0;
  while (index < array.length) {
    chunked.push(array.slice(index, index + size));
    index += size;
  }
  return chunked;
};

export const has = Object.prototype.hasOwnProperty; // cache the lookup once, in module scope.

/**
 *
 * @param {*} arrPropsToDelete Array of Properties to Delete from a object
 * @param {*} obj => the object to manipulate
 */
export const deletePropertiesFromObject = (arrPropsToDelete, obj) => {
  const newObj = { ...obj };
  arrPropsToDelete.forEach((_, index) => {
    if (arrPropsToDelete.includes(arrPropsToDelete[index])) {
      delete newObj[arrPropsToDelete[index]];
    }
  });
  return newObj;
};

export const HAS_WINDOW = typeof window !== 'undefined';

export const doLocalStorage = () =>
  HAS_WINDOW
    ? {
        getItem: item => localStorage.getItem(item),
        setItem: (key, item) => localStorage.setItem(key, item),
        removeItem: item => localStorage.removeItem(item),
      }
    : {
        getItem: () => null,
        setItem: () => null,
        removeItem: () => null,
      };

export const formatAmount = amt => `$${(amt ? amt / 100 : 0).toFixed(2)}`;
