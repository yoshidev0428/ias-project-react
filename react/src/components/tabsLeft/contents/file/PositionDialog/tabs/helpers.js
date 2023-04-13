export function getAvailableDimensions(series) {
  const dims = [];
  const sqrt = Math.sqrt(series);
  for (let i = 1; i <= sqrt; i++) {
    if (series % i === 0) {
      const factor1 = i;
      const factor2 = series / i;
      const ratio = Math.min(factor1, factor2) / Math.max(factor1, factor2);

      if (ratio >= 0.1) {
        dims.push([factor1, factor2]);
        dims.push([factor2, factor1]);
      }
    }
  }
  return dims.sort((a, b) => a[0] - b[0]);
}
