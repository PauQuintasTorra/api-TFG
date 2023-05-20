const math = require("mathjs");
const saveArrayIntoImage = require("./Utils");

class Quantizer {
  constructor(q_step) {
    this.inputArray = {};
    this.q_step = q_step;
  }

  mainQuantize(inputArray, formatImage) {
    this.inputArray = inputArray;

    const quan_red = this.quantize(inputArray.red);
    const quan_green = this.quantize(inputArray.green);
    const quan_blue = this.quantize(inputArray.blue);

    saveArrayIntoImage(quan_red, quan_green, quan_blue, `quantizer_${this.q_step}.${formatImage}`);
    
    return { red: quan_red, green: quan_green, blue: quan_blue };
  }

  mainDequantize(inputArray, formatImage) {
    this.inputArray = inputArray;
    const dequan_red = this.dequantize(inputArray.red);
    const dequan_green = this.dequantize(inputArray.green);
    const dequan_blue = this.dequantize(inputArray.blue);

    saveArrayIntoImage(dequan_red, dequan_green, dequan_blue, `dequantizer_${this.q_step}.${formatImage}`);
    
    return { red: dequan_red, green: dequan_green, blue: dequan_blue };
  }

  quantize(matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        const abs_number = math.abs(matrix[y][x]);
        const number = math.floor(abs_number / this.q_step);
        if (matrix[y][x] != 0) {
          matrix[y][x] =
            number * parseInt(math.floor(abs_number / matrix[y][x]));
        } else {
          matrix[y][x] = 0;
        }
      }
    }
    return matrix;
  }

  dequantize(matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        matrix[y][x] = parseInt(matrix[y][x] * this.q_step);
      }
    }
    return matrix;
  }
}

module.exports = Quantizer;
