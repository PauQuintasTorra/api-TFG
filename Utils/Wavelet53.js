const { row } = require("mathjs");
const saveArrayIntoImage = require("./Utils");

class Wavelet53 {
  constructor(x, y, level) {
    this.SubbandSizeX = x;
    this.SubbandSizeY = y;
    this.level = level;
  }

  mainTransform(inputArray, formatImage) {
    const trans_inputArray = this.transformWavelet53_RGB(
      inputArray,
      this.level
    );

    saveArrayIntoImage(
      trans_inputArray.red,
      trans_inputArray.green,
      trans_inputArray.blue,
      `wavelet_53_${this.level}.${formatImage}`
    );

    return trans_inputArray;
  }

  transformWavelet53_RGB(inputArray, levels) {
    inputArray.red = this.wavelet53Transform2D(inputArray.red, levels);
    inputArray.green = this.wavelet53Transform2D(inputArray.green, levels);
    inputArray.blue = this.wavelet53Transform2D(inputArray.blue, levels);
    return inputArray;
  }

  wavelet53Transform2D(input, levels) {
    let rows = input.length;
    let cols = input[0].length;

    if (rows % 2 != 0) {
      rows -= 1;
    }
    if (cols % 2 != 0) {
      cols -= 1;
    }

    for (let level = 0; level < levels; level++) {
      for (let i = 0; i < rows; i++) {
        input[i] = this.wavelet53Transform(input[i]);
      }

      const transposed = this.transpose(input);

      for (let i = 0; i < cols; i++) {
        transposed[i] = this.wavelet53Transform(transposed[i]);
      }

      input = this.transpose(transposed);
    }

    return input;
  }

  wavelet53Transform(input) {
    const length = input.length;

    const mid = Math.floor(length / 2);

    const lowPass = new Array(mid);
    const highPass = new Array(mid);

    for (let i = 0; i < mid; i++) {
      const a = input[2 * i];
      const b = input[2 * i + 1];
      const c = (a + b) / 2;
      const d = (b - c) / 2;

      lowPass[i] = c;
      highPass[i] = d;
    }

    const transformed = [...lowPass, ...highPass];

    return transformed;
  }

  transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]));
  }
}

module.exports = Wavelet53;
