export const shortifyHash = (hash) => {
  return hash.substring(0, 9) + "..." + hash.substring(54, 64);
};

export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}