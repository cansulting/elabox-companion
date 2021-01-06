export const shortifyHash = (hash) => {
  return hash.substring(0, 9) + "..." + hash.substring(54, 64);
};
