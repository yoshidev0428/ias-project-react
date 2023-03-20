export const Options = (kerSize) => {
  const baseArray = Array(Math.pow(kerSize, 2)).fill(1);
  const minBaseArray = Array(Math.pow(kerSize, 2)).fill(-1);

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return {
    // Emhasis
    Low_pass: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: (kerSize) => {
        return baseArray.map((num) => num / Math.pow(kerSize, 2));
      },
    },

    High_pass: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: (kerSize) => {
        minBaseArray[Math.floor(Math.pow(kerSize, 2) / 2)] =
          -minBaseArray.reduce(reducer) - 1;
        return minBaseArray;
      },
    },
    Sharpening: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: (kerSize) => {
        switch (kerSize) {
          case 3:
            return [0, -1, 0, -1, 5, -1, 0, -1, 0];
          case 5:
            return [
              -1, -1, -1, -1, -1, -1, 2, 2, 2, -1, -1, 2, 8, 2, -1, -1, 2, 2, 2,
              -1, -1, -1, -1, -1, -1,
            ];
          case 7:
            return [
              -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, 1, 4, 4,
              1, -1, -1, -1, 1, 4, 8, 1, -1, -1, -1, 1, 4, 4, 1, -1, -1, -1, 1,
              1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            ];
          default:
            break;
        }
      },
    },
    Median: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Threshold_1: 0, Threshold_2: 0, Passes: 1 },
      kernel: (_kerSize) => {
        return baseArray;
      },
    },
    Gauss: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7', '9X9'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: (kerSize) => {
        switch (kerSize) {
          case 3:
            return [
              0.075, 0.124, 0.075, 0.124, 0.204, 0.124, 0.075, 0.124, 0.075,
            ];
          case 5:
            return [
              0.003, 0.0133, 0.0219, 0.0133, 0.003, 0.0133, 0.0596, 0.0983,
              0.0596, 0.0133, 0.0219, 0.0983, 0.1621, 0.0983, 0.0219, 0.0133,
              0.0596, 0.0983, 0.0596, 0.0133, 0.003, 0.0133, 0.0219, 0.0133,
              0.003,
            ];
          case 7:
            return [
              0, 0.0002, 0.0011, 0.0018, 0.0011, 0.0002, 0, 0.0002, 0.0029,
              0.0131, 0.0216, 0.0131, 0.0029, 0.0002, 0.0011, 0.0131, 0.0586,
              0.0966, 0.0586, 0.0131, 0.0011, 0.0018, 0.0216, 0.0966, 0.1592,
              0.0966, 0.0216, 0.0018, 0.0011, 0.0131, 0.0586, 0.0966, 0.0586,
              0.0131, 0.0011, 0.0002, 0.0029, 0.0131, 0.0216, 0.0131, 0.0029,
              0.0002, 0, 0.0002, 0.0011, 0.0018, 0.0011, 0.0002, 0,
            ];
          case 9:
            return [
              0.0, 0.0, 0.0, 0.0, 1.0e-4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0e-4,
              1.1e-3, 1.8e-3, 1.1e-3, 2.0e-4, 0.0, 0.0, 0.0, 2.0e-4, 2.9e-3,
              1.31e-2, 2.15e-2, 1.31e-2, 2.9e-3, 2.0e-4, 0.0, 0.0, 1.1e-3,
              1.31e-2, 5.86e-2, 9.65e-2, 5.86e-2, 1.31e-2, 1.1e-3, 0.0, 1.0e-4,
              1.8e-3, 2.15e-2, 9.65e-2, 1.592e-1, 9.65e-2, 2.15e-2, 1.8e-3,
              1.0e-4, 0.0, 1.1e-3, 1.31e-2, 5.86e-2, 9.65e-2, 5.86e-2, 1.31e-2,
              1.1e-3, 0.0, 0.0, 2.0e-4, 2.9e-3, 1.31e-2, 2.15e-2, 1.31e-2,
              2.9e-3, 2.0e-4, 0.0, 0.0, 0.0, 2.0e-4, 1.1e-3, 1.8e-3, 1.1e-3,
              2.0e-4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0e-4, 0.0, 0.0, 0.0, 0.0,
            ];
          default:
            break;
        }
      },
    },

    High_Gauss: {
      radioName: 'Kernel Size',
      radio: ['7X7', '9X9'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: (kerSize) => {
        switch (kerSize) {
          case 3:
            return [
              0.751, 1.238, 0.751, 1.238, 2.042, 1.238, 0.751, 1.238, 0.751,
            ];
          case 5:
            return [
              0.03, 0.133, 0.219, 0.133, 0.03, 0.133, 0.596, 0.983, 0.596,
              0.133, 0.219, 0.983, 1.621, 0.983, 0.219, 0.133, 0.596, 0.983,
              0.596, 0.133, 0.03, 0.133, 0.219, 0.133, 0.03,
            ];
          case 7:
            return [
              0, 0.002, 0.011, 0.018, 0.011, 0.002, 0, 0.002, 0.029, 0.131,
              0.216, 0.131, 0.029, 0.002, 0.011, 0.131, 0.586, 0.966, 0.586,
              0.131, 0.011, 0.018, 0.216, 0.966, 1.592, 0.966, 0.216, 0.018,
              0.011, 0.131, 0.586, 0.966, 0.586, 0.131, 0.011, 0.002, 0.029,
              0.131, 0.216, 0.131, 0.029, 0.002, 0, 0.002, 0.011, 0.018, 0.011,
              0.002, 0,
            ];
          case 9:
            return [
              0.0, 0.0, 0.0, 0.0, 1.0e-3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0e-3,
              1.1e-2, 1.8e-2, 1.1e-2, 2.0e-3, 0.0, 0.0, 0.0, 2.0e-3, 2.9e-2,
              1.31e-1, 2.15e-1, 1.31e-1, 2.9e-2, 2.0e-3, 0.0, 0.0, 1.1e-2,
              1.31e-1, 5.86e-1, 9.65e-1, 5.86e-1, 1.31e-1, 1.1e-2, 0.0, 1.0e-3,
              1.8e-2, 2.15e-1, 9.65e-1, 1.592, 9.65e-1, 2.15e-1, 1.8e-2, 1.0e-3,
              0.0, 1.1e-2, 1.31e-1, 5.86e-1, 9.65e-1, 5.86e-1, 1.31e-1, 1.1e-2,
              0.0, 0.0, 2.0e-3, 2.9e-2, 1.31e-1, 2.15e-1, 1.31e-1, 2.9e-2,
              2.0e-3, 0.0, 0.0, 0.0, 2.0e-3, 1.1e-2, 1.8e-2, 1.1e-2, 2.0e-3,
              0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0e-3, 0.0, 0.0, 0.0, 0.0,
            ];
          default:
            break;
        }
      },
    },
    Local_Equalization: {
      radioName: 'Kernel Size',
      radio: [
        'Linear',
        'Exponential',
        'Logarithm',
        'Bell',
        'Best fit',
        'St.Deviation',
      ],
      inputNum: { St_Deviation: 1, Windows_Size: 30, Step: 1 },
      kernel: (_kerSize) => {
        return [];
      },
    },
    Flattening: {
      radioName: 'Kernel Size',
      radio: ['Dark', 'Bright'],
      inputNum: { Object_Width: 20 },
      kernel: (_kerSize) => {
        return [];
      },
    },
    Rank: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Threshold_1: 0, Threshold_2: 0, Rank: 50, Passes: 1 },
      kernel: (_kerSize) => {
        return [];
      },
    },
    Despeckle: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: [
        1 / 16,
        2 / 16,
        1 / 16,
        1 / 8,
        2 / 8,
        1 / 8,
        1 / 16,
        2 / 16,
        1 / 16,
      ],
    },
    Sigma: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7', '9X9'],
      inputNum: { St_Deviation: 100, Passes: 1 },
      kernel: [
        1 / 16,
        2 / 16,
        1 / 16,
        1 / 8,
        2 / 8,
        1 / 8,
        1 / 16,
        2 / 16,
        1 / 16,
      ],
    },
    Sigma_Median: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { St_Deviation: 2.5 },
      kernel: [],
    },
    // Edge
    Sobel: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 77, Passes: 22 },
      kernel: [-1, 0, 1 - 2, 0, 2 - 1, 0, 1],
    },
    Roberts: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 33 },
      kernel: [],
    },
    Laplacian: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: [],
    },
    Variance: { radioName: '', radio: [], inputNum: { Width: 100, Height: 1 } },
    Sobel_phase: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: [],
    },
    Horizontal_edge: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: [0.7, 1, 1, 0.7, 1, 0.7, 0.7, 1, 0.7],
    },
    Vertical_edge: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: [-1, -2, -1, 0, 0, 0, 1, 2, 1],
    },
    Canny: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Low: 100, High: 1 },
      kernel: [],
    },
    Gabor: { radioName: '', radio: [], inputNum: { Period: 100, Angle: 1 } },
    DIC_Restore: { radioName: '', radio: [], inputNum: { Angle: 0 } },
    // Morphological
    Open: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      kernel: [],
    },
    Close: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      kernel: [],
    },
    Erode: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      kernel: [],
    },
    Dilate: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      kernel: [0, 1, 0, 1, 1, 1, 0, 1, 0],
    },
    Top_hat: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: [],
    },
    Well: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: [],
    },
    // Kernels
    Convolution: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      kernel: [],
    },
    Morphological: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      kernel: [],
    },
    Sculpture: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      kernel: [],
    },
    Background: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      kernel: [],
    },

    //Learge
    Low_Pass: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: [],
    },
    High_Pass: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '11X11'],
      inputNum: { Strength: 100, Passes: 1 },
      kernel: [],
    },
  };
};
