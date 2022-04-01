// Pattern Matching
const matchPixels = (baseLine, movingLine) => {
  // console.log("baseLine");
  // console.log(baseLine[0]);
  // console.log("movingLine");
  // console.log(movingLine[0]);
  if (baseLine.length === 0 || movingLine.length === 0) return 0;

  const checkingRangePre = 10;
  const checkingRange = parseInt(movingLine.length / checkingRangePre);

  /*
  Scan starts
       Baseline:          |-----------------------------|
       Moveline:  |-----------------------------|
  Scan ens
       Baseline:          |-----------------------------|
       Moveline:                  ->>   |-----------------------------|
  The common range between the baseline and moveline is where the score is calculated.
  */

  const searchStart =
    baseLine.length >= movingLine.length
      ? -checkingRange
      : baseLine.length - movingLine.length;
  const searchEnd =
    baseLine.length >= movingLine.length
      ? baseLine.length - parseInt(movingLine.length - checkingRange)
      : 0;

  // console.log("searchStart: " + searchStart);
  // console.log("searchEnd: " + searchEnd);

  // Calculate the score by moving the moveline a few pixels a time from left to right.
  const movingStep = 1;
  const channel = 3;
  let scores = [];
  for (let i = searchStart; i < searchEnd; i += movingStep) {
    var score = 0;
    var divider = 1;
    for (let j = 0; j < movingLine.length; j++) {
      for (let c = 0; c < channel; c++) {
        let baseIdx = i + j;
        if (baseIdx < 0 || baseIdx >= baseLine.length) {
          score += 0;
        } else {
          // Smaller difference, bigger score. 120 is just an arbitrary base score.
          const s = 120 - Math.abs(baseLine[baseIdx][c] - movingLine[j][c]);
          score += s;
          divider++;
        }
      }
    }
    scores.push(score / divider);
  }
  let maxS = Math.max(...scores);
  let idx = scores.indexOf(maxS) * movingStep;

  // console.log("maxS: " + maxS + "  idx: " + idx);

  return searchStart + idx;
};

const imgXDistance = (imgA, imgB) => {
  return Math.abs(imgA.x - imgB.x);
};

const imgYDistance = (imgA, imgB) => {
  return Math.abs(imgA.y - imgB.y);
};

const imgHorizontalDistance = (imgA, imgB) => {
  let dis = 0;
  if (imgA.x < imgB.x) {
    dis = imgB.x - imgA.x - imgA.width;
  } else {
    dis = imgA.x - imgB.x - imgB.width;
  }
  if (dis < 0) dis = 0;

  return dis;
};

const imgVerticalDistance = (imgA, imgB) => {
  let dis = 0;
  if (imgA.y < imgB.y) {
    dis = imgB.y - imgA.y - imgA.height;
  } else {
    dis = imgA.y - imgB.y - imgB.height;
  }
  if (dis < 0) dis = 0;

  return dis;
};

export {
  matchPixels,
  imgXDistance,
  imgYDistance,
  imgHorizontalDistance,
  imgVerticalDistance
};
