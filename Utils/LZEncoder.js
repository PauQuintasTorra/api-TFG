const lzjs = require("lzjs");
const fs = require("fs");
const ManageImage = require("./ManageImage");

class LZEncoder {
  constructor() {}

  async mainprova(originalInputArray, inputArray, xToCut, yToCut) {
    const inputArrayDimensionsGood = JSON.parse(JSON.stringify(inputArray));
    const im = new ManageImage();
    const redFinal = im.selectPositions(
      inputArrayDimensionsGood.red,
      0,
      yToCut,
      0,
      xToCut
    );
    const greenFinal = im.selectPositions(
      inputArrayDimensionsGood.green,
      0,
      yToCut,
      0,
      xToCut
    );
    const blueFinal = im.selectPositions(
      inputArrayDimensionsGood.blue,
      0,
      yToCut,
      0,
      xToCut
    );

    const finalResult = { red: redFinal, green: greenFinal, blue: blueFinal };
    const originalRed = originalInputArray.red;
    const originalGreen = originalInputArray.green;
    const originalBlue = originalInputArray.blue;

    const Red = finalResult.red;
    const Green = finalResult.green;
    const Blue = finalResult.blue;

    const dataOriginal = JSON.stringify({
      originalRed,
      originalGreen,
      originalBlue,
    });
    const dataToCompress = JSON.stringify({ Red, Green, Blue });
    const compressed = lzjs.compressToBase64(dataToCompress);
    const decoded = lzjs.decompressFromBase64(compressed);
    const decodeSize = decoded.length;

    const height = Red.length;
    const width = Red[0].length;

    const originalStats = this.calculateBitsPixels(
      height,
      width,
      originalInputArray
    );
    const { bits, pixels } = this.calculateBitsPixels(
      height,
      width,
      finalResult
    );

    const bitsPerSampleOriginal = originalStats.bits / originalStats.pixels;
    const bitsPerSample = bits / pixels;
    const encodedSize = compressed.length;
    const compressionRatio = dataOriginal.length / encodedSize;

    return {
      compressionRatio: compressionRatio,
      bitsPerSample: bitsPerSample,
      bitsPerSampleOriginal: bitsPerSampleOriginal,
    };
  }

  calculateBitsPixels(height, width, inputArray) {
    const array = JSON.parse(JSON.stringify(inputArray));

    let totalBits = 0;
    let totalPixels = 0;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const redBinary = array.red[i][j].toString(2);
        const greenBinary = array.green[i][j].toString(2);
        const blueBinary = array.blue[i][j].toString(2);

        totalBits += redBinary.length + greenBinary.length + blueBinary.length;
        totalPixels++;
      }
    }

    return { bits: totalBits, pixels: totalPixels };
  }
}

module.exports = LZEncoder;
