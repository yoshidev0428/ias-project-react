import { COLOR_PALETTE } from '@/constants';
import {
  DEFAULT_COLOR_OFF,
  MAX_CHANNELS,
  MAX_COLOR_INTENSITY,
} from '@vivjs/constants';

/** @typedef {import('@vivjs/types').Color} Color */

/**
 * @template T
 * @param {T[]} arr
 * @param {T} defaultValue
 * @param {number} padWidth
 *
 * @TODO copied from `@vivjs/layers` to avoid circular deps
 */
export function padWithDefault(arr, defaultValue, padWidth) {
  for (let i = 0; i < padWidth; i += 1) {
    arr.push(defaultValue);
  }
  return arr;
}

/** @param {number} n */
export function getDefaultPalette(n) {
  if (n > COLOR_PALETTE.length) {
    throw new Error('Too many colors');
  }
  return COLOR_PALETTE.slice(0, n);
}

/** @param {{ colors: Color[], channelsVisible: boolean[] }} */
export function padColors({ colors, channelsVisible }) {
  /** @type {Color[]} */
  const newColors = colors.map((color, i) =>
    channelsVisible[i]
      ? color.map((c) => c / MAX_COLOR_INTENSITY)
      : DEFAULT_COLOR_OFF,
  );
  const padSize = MAX_CHANNELS - newColors.length;
  const paddedColors = padWithDefault(
    newColors,
    /** @type {Color} */ (DEFAULT_COLOR_OFF),
    padSize,
  ).reduce((acc, val) => acc.concat(val), []);
  return paddedColors;
}
