import tinycolor from "tinycolor2";
import percentile from "percentile";
import { GPU, input } from "gpu.js";
import { rfft2d, irfft2d } from "./kissfft";
// require("log-timestamp");

function getStandardDeviation(array) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}
function getMean(array) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return mean;
}

function rgb2hsv_diffc(c, v, diff) {
  return (v - c) / 6 / diff + 1 / 2;
}

const rgb2hsv = arr => {
  let rr = 0;
  let gg = 0;
  let bb = 0;
  let r = arr[0] / 255;
  let g = arr[1] / 255;
  let b = arr[2] / 255;
  let h = 0;
  let s = 0;
  let v = Math.max(Math.max(r, g), b);
  let diff = v - Math.min(Math.min(r, g), b);

  if (diff === 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = rgb2hsv_diffc(r, v, diff);
    gg = rgb2hsv_diffc(g, v, diff);
    bb = rgb2hsv_diffc(b, v, diff);

    if (r === v) {
      h = bb - gg;
    } else if (g === v) {
      h = 1 / 3 + rr - bb;
    } else if (b === v) {
      h = 2 / 3 + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
};

const hsv2rgb = hsv => {
  let _l = hsv[0];
  let _m = hsv[1];
  let _n = hsv[2];
  let newR = 0;
  let newG = 0;
  let newB = 0;
  if (_m === 0) {
    _l = _m = _n = Math.round((255 * _n) / 100);
    newR = _l;
    newG = _m;
    newB = _n;
  } else {
    _m = _m / 100;
    _n = _n / 100;
    let p = Math.floor(_l / 60) % 6;
    let f = _l / 60 - p;
    let a = _n * (1 - _m);
    let b = _n * (1 - _m * f);
    let c = _n * (1 - _m * (1 - f));
    if (p == 0) {
      newR = _n;
      newG = c;
      newB = a;
    } else if (p == 1) {
      newR = b;
      newG = _n;
      newB = a;
    } else if (p == 2) {
      newR = a;
      newG = _n;
      newB = c;
    } else if (p == 3) {
      newR = a;
      newG = b;
      newB = _n;
    } else if (p == 4) {
      newR = c;
      newG = a;
      newB = _n;
    } else if (p == 5) {
      newR = _n;
      newG = a;
      newB = b;
    }
    newR = Math.round(255 * newR);
    newG = Math.round(255 * newG);
    newB = Math.round(255 * newB);
  }
  return [newR, newG, newB, 255];
};

function rgb2yuv(R, G, B) {
  let Y = 0.257 * R + 0.504 * G + 0.098 * B + 16;
  let V = 0.439 * R - 0.368 * G - 0.071 * B + 128;
  let U = -(0.148 * R) - 0.291 * G + 0.439 * B + 128;

  return [Y, U, V];
}

function yuv2rgb(Y, U, V) {
  let B = 1.164 * (Y - 16) + 2.018 * (U - 128);
  let G = 1.164 * (Y - 16) - 0.813 * (V - 128) - 0.391 * (U - 128);
  let R = 1.164 * (Y - 16) + 1.596 * (V - 128);

  return [R, G, B];
}

const gpu = new GPU();

const shadingCorrection2 = img => {
  let rgbImg = cv.imread(img);
  let labImg = new cv.Mat();
  let labImgChannels = new cv.MatVector();
  let background = new cv.Mat();
  let signedBground = new cv.Mat();
  let blurAnchor = new cv.Point(-1, -1);
  let blurKSize = new cv.Size(400, 400);
  let claheGridSize = new cv.Size(25, 25);
  let clane = new cv.CLAHE(2, claheGridSize);
  let subtractMask = new cv.Mat();

  cv.cvtColor(rgbImg, labImg, cv.COLOR_RGB2Lab, 3);
  cv.split(labImg, labImgChannels);
  let luminance = labImgChannels.get(0);

  cv.blur(luminance, background, blurKSize, blurAnchor, cv.BORDER_DEFAULT);

  let total = 0;
  for (let i in background.data) {
    let v = background.data[i];
    total = total + v;
  }
  let avg = Math.round(total / background.data.length);

  let preAdd = new cv.Mat(
    luminance.rows,
    luminance.cols,
    cv.CV_8S,
    new cv.Scalar(avg)
  );

  cv.subtract(background, preAdd, signedBground, subtractMask, cv.CV_8S);
  cv.subtract(luminance, signedBground, luminance, subtractMask, cv.CV_8U);

  clane.apply(luminance, luminance);

  cv.merge(labImgChannels, labImg);
  cv.cvtColor(labImg, rgbImg, cv.COLOR_Lab2LRGB, 4);

  let rs = rgbImg.data;

  rgbImg.delete();
  labImg.delete();
  labImgChannels.delete();
  background.delete();
  clane.delete();
  subtractMask.delete();
  luminance.delete();
  preAdd.delete();
  signedBground.delete();

  return rs;
};

const shadingCorrection = img => {
  const hsvKernel = gpu
    .createKernel(function(img) {
      let rgb = img[this.thread.y][this.thread.x];
      return rgb2yuv(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
    })
    .setOutput([img.width, img.height])
    .setFunctions([rgb2yuv]);
  let hsvImg = hsvKernel(img);
  hsvKernel.destroy();

  let totalH = 0;
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      totalH = totalH + hsvImg[j][i][0];
    }
  }
  let level = totalH / (img.width * img.height);

  const rollingBallKernel = gpu
    .createKernel(function(img, width, height, level) {
      let radius = 200; //Math.floor(width / 60);
      let yStart = this.thread.y - radius;
      let yEnd = this.thread.y + radius;

      let xStart = this.thread.x - radius;
      let xEnd = this.thread.x + radius;

      let total = 0;
      let count = 0;
      for (let y = yStart; y < yEnd; y = y + 10) {
        for (let x = xStart; x < xEnd; x = x + 10) {
          if (y >= 0 && x >= 0 && y < height && x < width) {
            let h = img[y][x][0];
            total = total + h;
            count = count + 1;
          }
        }
      }

      let y = img[this.thread.y][this.thread.x][0];
      let u = img[this.thread.y][this.thread.x][1];
      let v = img[this.thread.y][this.thread.x][2];
      let avg = Math.round(total / count);

      y = y + level - avg;
      if (y > level) {
        y = level + (y - level) * 1.1;
      } else {
        y = level - (level - y) * 1.1;
      }

      let rgb = yuv2rgb(y, u, v);
      let r = Math.round(rgb[0]);
      let g = Math.round(rgb[1]);
      let b = Math.round(rgb[2]);
      return [r, g, b, 255];
    })
    .setOutput([img.width, img.height])
    .setFunctions([yuv2rgb]);

  let resultImg = rollingBallKernel(hsvImg, img.width, img.height, level);
  rollingBallKernel.destroy();

  let rs = [];
  for (let row = img.height - 1; row >= 0; row--) {
    for (let col = 0; col < img.width; col++) {
      rs.push(resultImg[row][col][0]);
      rs.push(resultImg[row][col][1]);
      rs.push(resultImg[row][col][2]);
      rs.push(resultImg[row][col][3]);
    }
  }
  return rs;
};

const balanceLightingGPU2 = img => {
  const hsvKernel = gpu
    .createKernel(function(img) {
      let rgb = img[this.thread.y][this.thread.x];
      return rgb2yuv(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
    })
    .setOutput([img.width, img.height])
    .setFunctions([rgb2yuv]);
  let hsvImg = hsvKernel(img);
  hsvKernel.destroy();
  // console.log("hsvImg");
  // console.log(hsvImg);

  // const rgbKernel = gpu
  //   .createKernel(function(img, width) {
  //     let pi = Math.floor(this.thread.x / 4);
  //     let ro = Math.floor(pi / width);
  //     let co = pi % width;

  //     let rgb = yuv2rgb(img[ro][co][0], img[ro][co][1], img[ro][co][2]);
  //     return [rgb[0], rgb[1], rgb[2], 255][this.thread.x % 4];
  //   })
  //   .setOutput([img.width * img.height * 4])
  //   .setFunctions([hsv2rgb, yuv2rgb]);
  // let rgbImg = rgbKernel(hsvImg, img.width);
  // console.log("rgbImg");
  // console.log(rgbImg);
  // rgbKernel.destroy();
  // return rgbImg;

  const logKernel = gpu
    .createKernel(function(img2, width) {
      let row = Math.floor(this.thread.x / width);
      let col = this.thread.x % width;

      // return img[row][col];
      // let r = values[2];
      // let v = 1; //Math.log1p(r);
      return Math.log1p(img2[row][col][0]);
      // return Math.log1p(v);
    })
    .setOutput([img.width * img.height]);
  let logValues = logKernel(hsvImg, img.width);
  // console.log("logValues");
  // console.log(logValues);
  logKernel.destroy();

  let fftValues = rfft2d(logValues, img.width, img.height);

  const butterworthFilterKernel = gpu
    .createKernel(function(width, height, p0, p1, a, b) {
      let x = this.thread.x % width;
      let y = Math.floor(this.thread.x / width);

      let P = Math.floor(width / 2);
      let Q = Math.floor(height / 2);
      let U = y;
      let V = x;

      // FFtShift
      let halfWidth = Math.ceil(width / 2);
      let halfHeight = Math.ceil(height / 2);
      V = (V + halfWidth) % width;
      U = (U + halfHeight) % height;

      let Duv = Math.pow(U - P, 2) + Math.pow(V - Q, 2);

      let H = 1 / (1 + Math.pow(Duv / Math.pow(p0, 2), p1));
      return a + b * (1 - H);
    })
    .setOutput([img.width * img.height]);
  let waterFilter = butterworthFilterKernel(
    img.width,
    img.height,
    180,
    2,
    0.25,
    0.8
  );
  butterworthFilterKernel.destroy();

  // apply the filter
  for (let i = 0; i < fftValues.length; i++) {
    fftValues[i] = fftValues[i] * waterFilter[Math.floor(i / 2)];
  }

  // let newlogValues = irfft2d(flattenFft, img.width, img.height);
  let newlogValues = irfft2d(fftValues, img.width, img.height);

  // Exp
  const expKernel = gpu
    .createKernel(function(logImg) {
      return Math.exp(logImg[this.thread.x]) - 1;
    })
    .setOutput([newlogValues.length]);
  let filteredData = expKernel(newlogValues);
  expKernel.destroy();

  // console.log(filteredData);

  // console.log("w: " + img.width + " h: " + img.height);
  const renderKernel = gpu
    .createKernel(function(hsvImg, data, width, height) {
      let pixIdx = Math.floor(this.thread.x / 4);

      let row = Math.floor(pixIdx / width);
      row = height - row; // ?

      let col = Math.floor(pixIdx % width);

      let u = hsvImg[row][col][1];
      let v = hsvImg[row][col][2];
      let y = data[row * width + col];
      let rgb = yuv2rgb(y, u, v);

      return [rgb[0], rgb[1], rgb[2], 255][this.thread.x % 4];
    })
    .setFunctions([yuv2rgb])
    .setOutput([img.width * img.height * 4]);

  let rs = renderKernel(hsvImg, filteredData, img.width, img.height);
  // console.log(rs);
  renderKernel.destroy();
  return rs;
};

const balanceLightingGPU = rgbData => {
  let outputLen = rgbData.length / 4;
  let removeLightSpotKernel = gpuKernel.setOutput([outputLen]);

  let newData = removeLightSpotKernel(rgbData, thredhold);

  for (let idx in newData) {
    rgbData[idx * 4] = newData[idx][0];
    rgbData[idx * 4 + 1] = newData[idx][1];
    rgbData[idx * 4 + 2] = newData[idx][2];
    rgbData[idx * 4 + 3] = newData[idx][3];
  }
};

const balanceLighting = imgData => {
  if (imgData.colorSpace == "srgb") {
    let hsvData = [];

    let brightnessTotal = 0;
    for (let pixPos = 0; pixPos < imgData.data.length; pixPos += 4) {
      let rgb = tinycolor({
        r: imgData.data[pixPos],
        g: imgData.data[pixPos + 1],
        b: imgData.data[pixPos + 2]
      });
      let hsv = rgb.toHsv();
      brightnessTotal += hsv.v;
      hsvData.push(hsv);
      // console.log("individual light: " + hsl.l);
    }

    if (hsvData.length == 0) return imgData;

    // let brightnesses = hsvData.map(item => item.v);
    // brightnesses.sort();
    // let threholdPos = parseInt(brightnesses.length * 0.8);
    // let threholdPos = parseInt(brightnesses.length * 0.7);
    // console.log("threholdPos: " + threholdPos);

    // let threhold = brightnesses[threholdPos];
    let threholdavg = brightnessTotal / hsvData.length;
    let threholdFix = 0.81;

    let thredhold = (threholdavg + threholdFix) / 2;

    if (threholdavg > thredhold) {
      thredhold = thredhold;
    }

    // console.log(brightnesses);
    // let lightValues = hsvData.map(item => item.v);
    // let medLights = median(lightValues);

    for (let idx in hsvData) {
      let hsv = hsvData[idx];
      if (hsv.v > thredhold) {
        hsv.v = thredhold;
        let toChangePox = idx * 4;
        let newRgb = tinycolor(hsv).toRgb();
        imgData.data[toChangePox] = newRgb.r;
        imgData.data[toChangePox + 1] = newRgb.g;
        imgData.data[toChangePox + 2] = newRgb.b;
      }
    }
  }

  return imgData;
};

const changeImageLuminance = (imgdata, value) => {
  const data = imgdata.data;
  for (let i = 0; i < data.length; i += 4) {
    const hsv = rgb2hsv([data[i], data[i + 1], data[i + 2]]);
    hsv[2] *= 1 + value;
    const rgb = hsv2rgb([...hsv]);
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }
  return imgdata;
};

// const bestImageLuminance

function getImgRow(imgPixcels, row, channel) {
  let startPox = imgPixcels.width * channel * row;
  let endPox = startPox + imgPixcels.width * channel;
  let theRow = imgPixcels.data.slice(startPox, endPox);

  let rs = [];
  for (let i = 0; i < imgPixcels.width; i++) {
    let pixValues = [];
    for (let j = 0; j < channel; j++) {
      pixValues.push(theRow[i * channel + j]);
    }
    rs.push(pixValues);
  }
  return rs;
}

function getImgColumn(imgPixcels, column, channel) {
  let rs = [];
  let startPox = column * channel;
  for (let lineNum = 0; lineNum < imgPixcels.height; lineNum++) {
    let pickPox = lineNum * imgPixcels.width * channel + startPox;

    let pixVals = [];
    for (let i = 0; i < channel; i++) {
      pixVals.push(imgPixcels.data[pickPox + i]);
    }
    rs.push(pixVals);
  }
  return rs;
}

/*
    Parameter Edge: 1 for top, 2 for right, 3 for bottom, 4 for left.
*/
const getImageEdge = (imgPixcels, edge, channel = 4, _width = 1) => {
  switch (edge) {
    case 1:
      return getImgRow(imgPixcels, 0, channel);
    case 2:
      return getImgColumn(imgPixcels, imgPixcels.width - 1, channel);
    case 3:
      return getImgRow(imgPixcels, imgPixcels.height - 1, channel);
    default:
      // assume the edge is 4
      return getImgColumn(imgPixcels, 0, channel);
  }
};

const imageAverageLuminance = imgdata => {
  const data = imgdata.data;
  let lum = 0;
  let lumCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    const hsv = rgb2hsv([data[i], data[i + 1], data[i + 2]]);
    lum += hsv[2];
    lumCount++;
  }
  return lum / lumCount;
};

const test_fit = imgData => {
  const data = imgData.data;
  const [min_percentile, max_percentile] = percentile([1, 99], data);
  const max = 255 * 0.9;
  const min = 255 * 0.1;
  const normalize = x => {
    return (x - min) / (max - min);
  };
  for (let i = 0; i < data.length; i += 4) {
    let flag = true;
    data.slice(i, i + 4).forEach(index => {
      if (data[i + index] < min_percentile) {
        data[i + index] = min_percentile;
        flag = false;
      } else if (data[i + index] > max_percentile) {
        data[i + index] = max_percentile;
        flag = false;
      }
    });
    if (!flag) continue;
    data[i] *= normalize(data[i]);
    data[i + 1] *= normalize(data[i + 1]);
    data[i + 2] *= normalize(data[i + 2]);
  }
  return imgData;
};

/**
 * 去掉BGR灰度直方图两侧较大亮度值, 自动适配Gamma
 * @param imgData
 */
const autoFitLuminance = imgData => {
  return test_fit(imgData);
  // const data = imgData.data;
  // let lumArray = [];
  // for (let i = 0; i < data.length; i += 4) {
  //   const hsv = rgb2hsv([data[i], data[i + 1], data[i + 2]]);
  //   lumArray.push(hsv[2]);
  // }
  // const [min_percentile, max_percentile] = percentile([1, 99], lumArray);
  // for (let i = 0; i < lumArray.length; i++) {
  //   if (lumArray[i] < min_percentile) {
  //     lumArray[i] = min_percentile;
  //     continue;
  //   }
  //   if (lumArray[i] > max_percentile) {
  //     lumArray[i] = max_percentile;
  //     continue;
  //   }
  //   const dst =
  //     (lumArray[i] - min_percentile) / (max_percentile - min_percentile);
  //   const hsv = rgb2hsv([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
  //   hsv[2] = lumArray[i] * dst;
  //   const rgb = hsv2rgb([...hsv]);
  //   data[i * 4] = rgb[0];
  //   data[i * 4 + 1] = rgb[1];
  //   data[i * 4 + 2] = rgb[2];
  // }
  // return imgData;
};

// const LUT = (imgData, gamma) => {};

export {
  rgb2hsv,
  hsv2rgb,
  changeImageLuminance,
  imageAverageLuminance,
  getImageEdge,
  balanceLighting,
  balanceLightingGPU,
  balanceLightingGPU2,
  autoFitLuminance,
  shadingCorrection,
  shadingCorrection2
};
