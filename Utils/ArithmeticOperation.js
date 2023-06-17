const saveArrayIntoImage = require("./Utils");

class ArithmeticOperation {
  constructor(value) {
    this.value = value;
  }

  mainAddValue(inputArray, formatImage) {
    this.inputArray = inputArray;

    const add_red = this.addValue(inputArray.red);
    const add_green = this.addValue(inputArray.green);
    const add_blue = this.addValue(inputArray.blue);

    saveArrayIntoImage(
      add_red,
      add_green,
      add_blue,
      `Add_${this.value}.${formatImage}`
    );

    return { red: add_red, green: add_green, blue: add_blue };
  }

  addValue(matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        matrix[y][x] = matrix[y][x] + this.value;
      }
    }
    return matrix;
  }

  mainSubstractValue(inputArray, formatImage) {
    this.inputArray = inputArray;

    const sub_red = this.substractValue(inputArray.red);
    const sub_green = this.substractValue(inputArray.green);
    const sub_blue = this.substractValue(inputArray.blue);

    saveArrayIntoImage(
      sub_red,
      sub_green,
      sub_blue,
      `Sub_${this.value}.${formatImage}`
    );

    return { red: sub_red, green: sub_green, blue: sub_blue };
  }

  substractValue(matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        matrix[y][x] = matrix[y][x] - this.value;
      }
    }
    return matrix;
  }

  mainMultiplyValue(inputArray, formatImage) {
    this.inputArray = inputArray;

    const mul_red = this.multiplyValue(inputArray.red);
    const mul_green = this.multiplyValue(inputArray.green);
    const mul_blue = this.multiplyValue(inputArray.blue);

    saveArrayIntoImage(
      mul_red,
      mul_green,
      mul_blue,
      `Mult_${this.value}.${formatImage}`
    );

    return { red: mul_red, green: mul_green, blue: mul_blue };
  }

  multiplyValue(matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        matrix[y][x] = matrix[y][x] * this.value;
      }
    }
    return matrix;
  }

  mainDivideValue(inputArray, formatImage) {
    this.inputArray = inputArray;

    const div_red = this.divideValue(inputArray.red);
    const div_green = this.divideValue(inputArray.green);
    const div_blue = this.divideValue(inputArray.blue);

    saveArrayIntoImage(
      div_red,
      div_green,
      div_blue,
      `Div_${this.value}.${formatImage}`
    );

    return { red: div_red, green: div_green, blue: div_blue };
  }

  divideValue(matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        if (matrix[y][x] == 0 || this.value == 0) {
          matrix[y][x] = 0;
        } else {
          matrix[y][x] = parseInt(matrix[y][x] / this.value);
        }
      }
    }
    return matrix;
  }
}

module.exports = ArithmeticOperation;
