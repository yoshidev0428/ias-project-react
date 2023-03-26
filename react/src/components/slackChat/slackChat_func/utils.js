export const debugLog = () => {
  if (process.env.NODE_ENV !== 'production') {
  }
};

export const arraysIdentical = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
