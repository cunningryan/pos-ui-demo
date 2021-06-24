export const getOSName = () => {
  let OSName = 'unknown';

  if (navigator.platform.indexOf('Android') !== -1) OSName = 'android';
  if (navigator.platform.indexOf('Linux') !== -1) OSName = 'android';
  if (navigator.platform.indexOf('iPhone') !== -1) OSName = 'ios';
  if (navigator.platform.indexOf('Win') !== -1) OSName = 'unsupported';
  if (navigator.platform.indexOf('MacIntel') !== -1) OSName = 'unsupported';

  return OSName;
};
