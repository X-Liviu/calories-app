export const getCounterClass = (length) => {
  if (length >= 30) return "input-char-count at-limit";
  if (length >= 25) return "input-char-count near-limit";
  return "input-char-count";
};
