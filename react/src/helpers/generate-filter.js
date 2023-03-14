export function generateLaplacianFilter(size) {
  let filter = [];

  const half = Math.floor(size / 2);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let x = i - half;
      let y = j - half;
      filter[i * size + j] =
        (x * x + y * y - 2 * half * half) / (2 * Math.PI * Math.pow(half, 4));
    }
  }
  filter = filter.map((v) => v * size);

  const center = Math.pow(size - 1, 2);
  const sum = filter.reduce((sum, val) => sum + val, 0) - filter[center];
  filter[center] = -sum;

  return filter;
}

export function generateGaussianFilter(sigma, size) {
  let filter = [];
  let sum = 0;
  let half = Math.floor(size / 2);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let x = i - half;
      let y = j - half;
      filter[i * size + j] =
        (1 / (2 * Math.PI * sigma * sigma)) *
        Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      sum += filter[i * size + j];
    }
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      filter[i * size + j] /= sum;
    }
  }

  return filter;
}

export function generateBoxFilter(size) {
  let filter = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      filter[i * size + j] = 1 / (size * size);
    }
  }

  return filter;
}
