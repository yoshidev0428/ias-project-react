export const Options = (kerSize) => {
  const baseArray = Array(Math.pow(kerSize, 2)).fill(1);
  const minBaseArray = Array(Math.pow(kerSize, 2)).fill(-1);
  const gaussKernel = (kerSize) => {
    const k = Math.floor(kerSize / 2);
    const sigma = 1;
    let kernel = new Array(kerSize * kerSize);
    let cnt = 0;
    for (let i = -k; i <= k; i++) {
      for (let j = -k; j <= k; j++) {
        kernel[cnt] =
          Math.exp(-(i * i + j * j) / (2 * sigma * sigma)) /
          (2 * Math.PI * sigma * sigma);
        cnt = cnt + 1;
      }
    }
    return kernel;
  };

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return {
    // Emhasis
    Low_pass: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 0,
      kernel: (kerSize) => {
        return baseArray.map((num) => num / Math.pow(kerSize, 2));
      },
    },

    High_pass: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 1,
      kernel: (kerSize) => {
        minBaseArray[Math.floor(Math.pow(kerSize, 2) / 2)] =
          -minBaseArray.reduce(reducer);
        return minBaseArray;
      },
    },
    Sharpening: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 2,
      kernel: (kerSize) => {
        // const k = 0.1; // coefficient
        // const Gkernel = gaussKernel(kerSize);
        // let kernel = new Array(kerSize*kerSize);
        // let cnt = 0;
        // for (let i = 0; i < kerSize; i++) {
        //   for (let j = 0; j < kerSize; j++) {
        //     if (i===j) {
        //       kernel[cnt] = (1+k) - k*Gkernel[cnt];
        //     } else {
        //       kernel[cnt] = - k*Gkernel[cnt];
        //     }
        //     cnt = cnt + 1;
        //   }
        // }
        // return kernel;

        switch (kerSize) {
          case 3:
            return [0, -1, 0, -1, 5, -1, 0, -1, 0];
          case 5:
            return [
              -1 / 8,
              -1 / 8,
              -1 / 8,
              -1 / 8,
              -1 / 8,
              -1 / 8,
              2 / 8,
              2 / 8,
              2 / 8,
              -1 / 8,
              -1 / 8,
              2 / 8,
              8 / 8,
              2 / 8,
              -1 / 8,
              -1 / 8,
              2 / 8,
              2 / 8,
              2 / 8,
              -1 / 8,
              -1 / 8,
              -1 / 8,
              -1 / 8,
              -1 / 8,
              -1 / 8,
            ];
          case 7:
            const temp = [
              -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, 1, 4, 4,
              1, -1, -1, -1, 1, 4, 8, 1, -1, -1, -1, 1, 4, 4, 1, -1, -1, -1, 1,
              1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            ];
            temp.forEach((element, index) => {
              temp[index] = element / 13;
            });
            return temp;

          default:
            break;
        }
      },
    },
    Median: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Threshold_1: 0, Threshold_2: 0, Passes: 1 },
      index: 3,
      kernel: (kerSize) => {
        return baseArray.map((num) => num / Math.pow(kerSize, 2));
      },
    },
    Gauss: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7', '9X9'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 4,
      kernel: (kerSize) => gaussKernel(kerSize),

      // switch (kerSize) {

      //   case 3:
      //     return [
      //       0.075, 0.124, 0.075, 0.124, 0.204, 0.124, 0.075, 0.124, 0.075,
      //     ];
      //   case 5:
      //     return [
      //       0.003, 0.0133, 0.0219, 0.0133, 0.003, 0.0133, 0.0596, 0.0983,
      //       0.0596, 0.0133, 0.0219, 0.0983, 0.1621, 0.0983, 0.0219, 0.0133,
      //       0.0596, 0.0983, 0.0596, 0.0133, 0.003, 0.0133, 0.0219, 0.0133,
      //       0.003,
      //     ];
      //   case 7:
      //     return [
      //       0, 0.0002, 0.0011, 0.0018, 0.0011, 0.0002, 0, 0.0002, 0.0029,
      //       0.0131, 0.0216, 0.0131, 0.0029, 0.0002, 0.0011, 0.0131, 0.0586,
      //       0.0966, 0.0586, 0.0131, 0.0011, 0.0018, 0.0216, 0.0966, 0.1592,
      //       0.0966, 0.0216, 0.0018, 0.0011, 0.0131, 0.0586, 0.0966, 0.0586,
      //       0.0131, 0.0011, 0.0002, 0.0029, 0.0131, 0.0216, 0.0131, 0.0029,
      //       0.0002, 0, 0.0002, 0.0011, 0.0018, 0.0011, 0.0002, 0,
      //     ];
      //   case 9:
      //     return [
      //       0.0, 0.0, 0.0, 0.0, 1.0e-4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0e-4,
      //       1.1e-3, 1.8e-3, 1.1e-3, 2.0e-4, 0.0, 0.0, 0.0, 2.0e-4, 2.9e-3,
      //       1.31e-2, 2.15e-2, 1.31e-2, 2.9e-3, 2.0e-4, 0.0, 0.0, 1.1e-3,
      //       1.31e-2, 5.86e-2, 9.65e-2, 5.86e-2, 1.31e-2, 1.1e-3, 0.0, 1.0e-4,
      //       1.8e-3, 2.15e-2, 9.65e-2, 1.592e-1, 9.65e-2, 2.15e-2, 1.8e-3,
      //       1.0e-4, 0.0, 1.1e-3, 1.31e-2, 5.86e-2, 9.65e-2, 5.86e-2, 1.31e-2,
      //       1.1e-3, 0.0, 0.0, 2.0e-4, 2.9e-3, 1.31e-2, 2.15e-2, 1.31e-2,
      //       2.9e-3, 2.0e-4, 0.0, 0.0, 0.0, 2.0e-4, 1.1e-3, 1.8e-3, 1.1e-3,
      //       2.0e-4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0e-4, 0.0, 0.0, 0.0, 0.0,
      //     ];
      //   default:
      //     break;
      // }
    },
    High_Gauss: {
      radioName: 'Kernel Size',
      radio: ['7X7', '9X9'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 5,
      kernel: (kerSize) => {
        switch (kerSize) {
          case 3:
            return [-1, -1, -1, -1, 9, -1, -1, -1, -1];
          // return [
          //   0.751, 1.238, 0.751, 1.238, 2.042, 1.238, 0.751, 1.238, 0.751,

          // ];
          case 5:
            const temp = [
              -1 / 25,
              -1 / 25,
              -1 / 25,
              -1 / 25,
              -1 / 25,
              -1 / 25,
              1 / 5,
              1 / 5,
              1 / 5 - 1 / 25,
              -1 / 25,
              1 / 5,
              8 / 25,
              1 / 5 - 1 / 25,
              -1 / 25,
              1 / 5,
              1 / 5,
              1 / 5,
              -1 / 25,
              -1 / 25,
              -1 / 25,
              -1 / 25,
              -1 / 25,
              -1 / 25,
            ];
            // temp.forEach((element, index) => {
            //   temp[index] = element / 25;
            // });
            return temp;
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
      index: 6,
      kernel: (kerSize) => {
        return [];
      },
    },
    Flattening: {
      radioName: 'Kernel Size',
      radio: ['Dark', 'Bright'],
      inputNum: { Object_Width: 20 },
      index: 7,
      kernel: (kerSize) => {
        return [];
      },
    },
    Rank: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Threshold_1: 0, Threshold_2: 0, Rank: 50, Passes: 1 },
      index: 8,
      kernel: (kerSize) => {
        return [];
      },
    },
    Despeckle: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 9,
      kernel: (kerSize) => {
        return [
          1.0 / 16.0,
          2.0 / 16.0,
          1.0 / 16.0,
          2.0 / 16.0,
          4.0 / 16.0,
          12 / 16.0,
          1.0 / 16.0,
          2.0 / 16.0,
          1.0 / 16.0,
        ];
      },
    },
    Sigma: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7', '9X9'],
      inputNum: { St_Deviation: 100, Passes: 1 },
      index: 10,
      kernel: (kerSize) => {
        return [
          1 / 16.0,
          1 / 8.0,
          1 / 16.0,
          1 / 8.0,
          1 / 4.0,
          1 / 8.0,
          1 / 16.0,
          1 / 8.0,
          1 / 16.0,
        ];
      },
    },
    Sigma_Median: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { St_Deviation: 2.5 },
      index: 11,
      kernel: (kerSize) => {
        return [];
      },
    },
    // Edge
    Sobel: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 77, Passes: 22 },
      index: 12,
      kernel: (kerSize) => {
        return [-1, 0, 1 - 2, 0, 2, -1, 0, 1];
        // return [1, 2, -1, 2, 0, -2, -1, 2, 1]
      },
    },
    Roberts: {
      radioName: 'Kernel Size',
      radio: [],
      inputNum: { Strength: 100, Passes: 33 },
      index: 13,
      kernel: (kerSize) => {
        return [-1, 0, 1 - 2, 0, 2, -1, 0, 1];
      },
    },
    Laplacian: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 14,
      kernel: (kerSize) => {
        return [0, -1, 0, -1, 4, -1, 0, -1, 0];
      },
    },
    Variance: { 
      radioName: '', 
      radio: [], 
      inputNum: { Width: 100, Height: 1 },
      index: 99,
      kernel: (kerSize) => {
        return [0, -1, 0, -1, 4, -1, 0, -1, 0];
      },      
      
    },
    Sobel_phase: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 15,
      kernel: (kerSize) => {
        return [];
      },
    },
    Horizontal_edge: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 16,
      kernel: (kerSize) => {
        return [1, 2, 1, 0, 0, 0, -1, -2, -1];
      },
    },
    Vertical_edge: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 17,
      kernel: (kerSize) => {
        return [1, 0, -1, 2, 0, -2, 1, 0, -1];
      },
    },
    Canny: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Low: 7, High: 10 },
      index: 18,
      kernel: (kerSize) => {
        return [];
      },
    },
    Gabor: { 
        radioName: '', 
        radio: [], 
        inputNum: { Period: 100, Angle: 1 },
        index: 19,
        kernel: (kerSize) => {
            return [];
        },
    },
    DIC_Restore: { 
        radioName: '', 
        radio: [], 
        inputNum: { Angle: 0 },
      index: 20,
      kernel: (kerSize) => {
        return [];
      },        
    },
    // Morphological
    Open: {
      radioName: 'Shape',
      radio: ['3X3 Square', '5X5 Square', '7X7 Square', '9X9 Square', '11X11 Square'],
      inputNum: { Passes: 1 },
      index: 21,
      kernel: (kerSize) => {
        return [];
      },
    },
    Close: {
      radioName: 'Shape',
      radio: ['3X3 Square', '5X5 Square', '7X7 Square', '9X9 Square', '11X11 Square'],
      inputNum: { Passes: 1 },
      index: 22,
      kernel: (kerSize) => {
        return [];
      },
    },
    Erode: {
      radioName: 'Shape',
      radio: ['3X3 Square', '5X5 Square', '7X7 Square', '9X9 Square', '11X11 Square'],
      inputNum: { Passes: 1 },
      index: 23,
      kernel: (kerSize) => {
        return [];
      },
    },
    Dilate: {
      radioName: 'Shape',
      radio: ['3X3 Square', '5X5 Square', '7X7 Square', '9X9 Square', '11X11 Square'],
      inputNum: { Passes: 1 },
      index: 24,
      kernel: (kerSize) => {
        return [];
      },
    },
    Top_hat: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 25,
      kernel: (kerSize) => {
        return [];
      },
    },
    Well: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 26,
      kernel: (kerSize) => {
        return [];
      },
    },
    // Kernels
    Convolution: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      index: 27,
      kernel: (kerSize) => {
        return [];
      },
    },
    Morphological: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      index: 28,
      kernel: (kerSize) => {
        return [];
      },
    },
    Sculpture: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      index: 29,
      kernel: (kerSize) => {
        return [];
      },
    },
    Background: {
      radioName: 'Shape',
      radio: ['2X2 Square', '3X1 Row', '3X3 Cross'],
      inputNum: { Passes: 1 },
      index: 30,
      kernel: (kerSize) => {
        return [];
      },
    },

    //Learge
    Low_Pass: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '7X7'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 31,
      kernel: (kerSize) => {
        return [];
      },
    },
    High_Pass: {
      radioName: 'Kernel Size',
      radio: ['3X3', '5X5', '11X11'],
      inputNum: { Strength: 100, Passes: 1 },
      index: 32,
      kernel: (kerSize) => {
        return [];
      },
    },
  };
};
