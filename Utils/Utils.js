const math = require("mathjs");
const Jimp = require("jimp");
const { reject } = require("lodash");

function trans_abs(matrix) {
  for (let x = 0; x < matrix[0].length; x++) {
    for (let y = 0; y < matrix.length; y++) {
      matrix[y][x] = parseInt(math.abs(matrix[y][x]));
    }
  }
  return matrix;
}

function normalizeMatrix(matrix) {
  const max_matrix = math.max(math.flatten(matrix));
  const min_matrix = math.min(math.flatten(matrix));
  if (max_matrix <= 255 && math.abs(min_matrix) <= 255 && min_matrix >= 0) {
    return matrix;
  } else {
    if (max_matrix <= 255 && math.abs(min_matrix) <= 255 && min_matrix < 0) {
      return trans_abs(matrix);
    }
    let matrix_abs = trans_abs(matrix);
    const max_matrix_abs = math.max(math.flatten(matrix_abs));

    for (let x = 0; x < matrix_abs[0].length; x++) {
      for (let y = 0; y < matrix_abs.length; y++) {
        matrix_abs[y][x] = math.round(
          (matrix_abs[y][x] / max_matrix_abs) * 255
        );
      }
    }

    return matrix_abs;
  }
}

async function arrayReadyToWork(inputArray, SubbandSizeX, SubbandSizeY) {
  const { subBandX, subBandY } = checkPotential(SubbandSizeX, SubbandSizeY);

  const new_red = correctArrayToTransform(inputArray.red, subBandX, subBandY);
  const new_green = correctArrayToTransform(
    inputArray.green,
    subBandX,
    subBandY
  );
  const new_blue = correctArrayToTransform(inputArray.blue, subBandX, subBandY);

  const newArray = JSON.parse(
    JSON.stringify({ red: new_red, green: new_green, blue: new_blue })
  );
  return newArray;
}

function selectPositions(array2D, startRow, endRow, startColumn, endColumn) {
  return new Promise((resolve, reject) => {
    const selectedArray = [];

    for (let i = startRow; i < endRow; i++) {
      const row = array2D[i];
      const selectedRow = row.slice(startColumn, endColumn);
      selectedArray.push(selectedRow);
    }

    resolve(selectedArray);
  });
}

function correctArrayToTransform(
  inputArray,
  subBandX,
  subBandY,
  SubbandSizeX,
  SubbandSizeY
) {
  const originalArray = inputArray;
  const xExpansion = subBandX - SubbandSizeX;

  let expandedArray = inputArray;
  if (xExpansion != 0) {
    expandedArray = originalArray.map((row) => [
      ...row,
      ...row.slice(-xExpansion).reverse(),
    ]);
  }

  const originalArrayY = transposeArray(expandedArray);

  const yExpansion = subBandY - SubbandSizeY;

  let expandedArrayY = originalArrayY;
  if (yExpansion != 0) {
    expandedArrayY = originalArrayY.map((row) => [
      ...row,
      ...row.slice(-yExpansion).reverse(),
    ]);
  }

  return transposeArray(expandedArrayY);
}

function checkPotential(SubbandSizeX, SubbandSizeY) {
  let subBandX = SubbandSizeX;
  let subBandY = SubbandSizeY;
  let settedX = false;
  let settedY = false;

  for (let i = 0; i < 15; i++) {
    if (!settedX) {
      if (subBandX === 2 ** i) {
        settedX = true;
      } else {
        if (subBandX < 2 ** i) {
          subBandX = 2 ** i;
          settedX = true;
        }
      }
    }
    if (!settedY) {
      if (subBandY === 2 ** i) {
        settedY = true;
      } else {
        if (subBandY < 2 ** i) {
          subBandY = 2 ** i;
          settedY = true;
        }
      }
    }
  }
  return { subBandX: subBandX, subBandY: subBandY };
}

function transposeArray(array) {
  const rows = array.length;
  const columns = array[0].length;

  const transposedArray = [];
  for (let i = 0; i < columns; i++) {
    transposedArray[i] = [];
    for (let j = 0; j < rows; j++) {
      transposedArray[i][j] = array[j][i];
    }
  }

  return transposedArray;
}

async function saveArrayIntoImage(redArray, greenArray, blueArray, nameFile) {
  return new Promise((resolve, reject) => {
    const returner = JSON.parse(
      JSON.stringify({
        red: redArray,
        green: greenArray,
        blue: blueArray,
      })
    );

    const red_ = normalizeMatrix(returner.red);
    const green_ = normalizeMatrix(returner.green);
    const blue_ = normalizeMatrix(returner.blue);

    const image = new Jimp(redArray[0].length, redArray.length);
    red_.forEach((row, y) => {
      row.forEach((red, x) => {
        const green = green_[y][x];
        const blue = blue_[y][x];
        const pixelColor = Jimp.rgbaToInt(red, green, blue, 255);
        image.setPixelColor(pixelColor, x, y);
      });
    });
    image.write(nameFile, (err) => {
      if (err) {
        reject(err);
      }
      resolve(nameFile);
    });
  });
}

module.exports = trans_abs;
module.exports = normalizeMatrix;
module.exports = arrayReadyToWork;
module.exports = correctArrayToTransform;
module.exports = transposeArray;
module.exports = checkPotential;
module.exports = selectPositions;
module.exports = saveArrayIntoImage;
