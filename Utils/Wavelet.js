const math = require("mathjs");
const Jimp = require("jimp");

class Wavelet {
  constructor(x, y, level) {
    this.SubbandSizeX = x;
    this.SubbandSizeY = y;
    this.level = level;
  }
 
  mainTransform(inputArray, formatImage) {
    const trans_inputArray = this.RHaar_transByLevelRGB(inputArray);

    const returner = JSON.parse(JSON.stringify(trans_inputArray));

    const trans_absRed = this.trans_abs(trans_inputArray.red);
    const trans_absGreen = this.trans_abs(trans_inputArray.green);
    const trans_absBlue = this.trans_abs(trans_inputArray.blue);

    // Create a new Jimp image with the same dimensions as the input array
    const image = new Jimp(trans_absRed[0].length, trans_absRed.length);

    // Iterate over the input arrays and set the color of each pixel in the image
    trans_absRed.forEach((row, y) => {
      row.forEach((red, x) => {
        const green = trans_absGreen[y][x];
        const blue = trans_absBlue[y][x];
        const pixelColor = Jimp.rgbaToInt(red, green, blue, 255);
        image.setPixelColor(pixelColor, x, y);
      });
    });
    // Save the image as a JPEG file
    image.write(`wavelet_Haar_${this.level}.${formatImage}`);
    return returner;
  }

  mainDestransform(inputArray, formatImage) {
    this.SubbandSizeX = parseInt(inputArray.red[0].length / (2 ** this.level));
    this.SubbandSizeY = parseInt(inputArray.red.length / (2 ** this.level));

    const destrans_inputArray = this.RHaar_destransByLevelRGB(inputArray);

    const destrans_absRed = this.trans_abs(destrans_inputArray.red);
    const destrans_absGreen = this.trans_abs(destrans_inputArray.green);
    const destrans_absBlue = this.trans_abs(destrans_inputArray.blue);

    // Create a new Jimp image with the same dimensions as the input array
    const image = new Jimp(destrans_inputArray.red[0].length, destrans_inputArray.red.length);

    // Iterate over the input arrays and set the color of each pixel in the image
    destrans_absRed.forEach((row, y) => {
      row.forEach((red, x) => {
        const green = destrans_absGreen[y][x];
        const blue = destrans_absBlue[y][x];
        const pixelColor = Jimp.rgbaToInt(red, green, blue, 255);
        image.setPixelColor(pixelColor, x, y);
      });
    });
    // Save the image as a JPEG file
    image.write(`reverse_wavelet_Haar_${this.level}.${formatImage}`);
    return destrans_inputArray;
  }

  RHaar_forward(vector, r_c) {
    let size = 0;
    if (r_c == 'r') {
      size = parseInt(this.SubbandSizeX);
    } else {
      size = parseInt(this.SubbandSizeY);
    }
    const vector_t = Array(size).fill(0);
    let counter = 0;
    for (let v_id = 0; v_id < size; v_id += 2) {
      vector_t[Math.floor(size / 2) + counter] =
        vector[v_id + 1] - vector[v_id];

      vector_t[counter] =
        vector[v_id] + Math.floor(vector_t[Math.floor(size / 2) + counter] / 2);
      counter += 1;
    }
    return vector_t;
  }

  RHaar_inverse(vector_t, r_c) {
    let size = 0;
    if (r_c == 'r') {
      size = parseInt(this.SubbandSizeX);
    } else {
      size = parseInt(this.SubbandSizeY);
    }
    const vector_rec = Array(size).fill(0);
    const s_ = parseInt(size / 2);
    let counter = 0;
    for (let v_id = 0; v_id < size; v_id += 2) {
      vector_rec[v_id] =
        vector_t[counter] - Math.floor(vector_t[s_ + counter] / 2);
      vector_rec[v_id + 1] = vector_t[s_ + counter] + vector_rec[v_id];
      counter += 1;
    }
    return vector_rec;
  }

  RHaar_transform(matrix) {
    for (let i = 0; i < this.SubbandSizeY; i++) {
      const aux = this.RHaar_forward(matrix[i], 'r');
      for(let a = 0; a < aux.length; a++){
        matrix[i][a] = aux[a];
      }
    }

    for (let j = 0; j < this.SubbandSizeX; j++) {
      const aux_j = this.RHaar_forward(this.extractColumn(matrix, j), 'c');
      for (let b = 0; b < aux_j.length; b++) {
        matrix[b][j] = aux_j[b];
      }
    }

    return matrix;
  }

  RHaar_destransform(matrix) {
    for (let j = 0; j < this.SubbandSizeX; j++) {
      const aux_j = this.RHaar_inverse(this.extractColumn(matrix, j), 'c');
      for (let b = 0; b < aux_j.length; b++) {
        matrix[b][j] = aux_j[b];
      }
    }

    for (let i = 0; i < this.SubbandSizeY; i++) {
      const aux = this.RHaar_inverse(matrix[i], 'r');
      for (let a = 0; a < aux.length; a++) {
        matrix[i][a] = aux[a];
      }
    }

    return matrix;
  }

  RHaar_transByLevel(matrix) {
    if (this.level > 7) {
      this.level = 7;
    }
    var m_ = this.RHaar_transform(matrix);
    if (this.level !== 0) {
      for (let l = 0; l < this.level; l++) {
        this.SubbandSizeX = parseInt(this.SubbandSizeX / 2);
        this.SubbandSizeY = parseInt(this.SubbandSizeY / 2);
        m_ = this.RHaar_transform(m_);
      }
    }
    return m_;
  }

  RHaar_transByLevelRGB(inputArray) {
    if (this.level > 7) {
      this.level = 7;
    }
    var m_red = this.RHaar_transform(inputArray.red);
    var m_green = this.RHaar_transform(inputArray.green);
    var m_blue = this.RHaar_transform(inputArray.blue);
    if (this.level !== 0) {
      for (let l = 0; l < this.level; l++) {
        this.SubbandSizeX = parseInt(this.SubbandSizeX / 2);
        this.SubbandSizeY = parseInt(this.SubbandSizeY / 2);
        m_red = this.RHaar_transform(m_red);
        m_green = this.RHaar_transform(m_green);
        m_blue = this.RHaar_transform(m_blue);
      }
    }
    return { red: m_red, green: m_green, blue: m_blue };
  }

  RHaar_destransByLevel(matrix) {
    if (this.level > 7) {
      this.level = 7;
    }
    this.SubbandSizeX = parseInt(matrix[0].length / 2 ** this.level);
    this.SubbandSizeY = parseInt(matrix.length / 2 ** this.level);
    let m_ = RHaar_destransform(matrix);
    if (this.level != 0) {
      for (let l = 0; l < this.level; l++) {
        this.SubbandSizeX = parseInt(this.SubbandSizeX * 2);
        this.SubbandSizeY = parseInt(this.SubbandSizeY * 2);
        m_ = RHaar_destransform(m_);
      }
    }
    return m_;
  }

  RHaar_destransByLevelRGB(inputArray) {
    if (this.level > 7) {
      this.level = 7;
    }

    var m_red = this.RHaar_destransform(inputArray.red);
    var m_green = this.RHaar_destransform(inputArray.green);
    var m_blue = this.RHaar_destransform(inputArray.blue);
    if (this.level !== 0) {
      for (let l = 0; l < this.level; l++) {
        console.log(this.SubbandSizeX)
        this.SubbandSizeX = parseInt(this.SubbandSizeX * 2);
        this.SubbandSizeY = parseInt(this.SubbandSizeY * 2);
        m_red = this.RHaar_destransform(m_red);
        m_green = this.RHaar_destransform(m_green);
        m_blue = this.RHaar_destransform(m_blue);
      }
    }
    return { red: m_red, green: m_green, blue: m_blue };
  }


  trans_abs(matrix) {
    for (let x = 0; x < matrix[0].length; x++) {
      for (let y = 0; y < matrix.length; y++) {
        matrix[y][x] = parseInt(Math.abs(matrix[y][x]));
        if(matrix[y][x] > 255) {
          matrix[y][x] = 255;
        } else {
          if (matrix[y][x] < -255) {
            matrix[y][x] = -255
          }
        }
      }
    }
    return matrix;
  }

  extractColumn(arr, column) {
    return arr.map((x) => x[column]);
  }

  getMaxMin(array) {
    let max = -Infinity;
    let min = Infinity;
  
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j] > max) {
          max = array[i][j];
        }
        if (array[i][j] < min) {
          min = array[i][j];
        }
      }
    }
    return { max, min };
  }
}

module.exports = Wavelet;
