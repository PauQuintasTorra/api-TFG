const lzjs = require('lzjs');
const fs = require('fs');

class LZEncoder {
  constructor() {}

  async mainprova(originalInputArray, inputArray){
    const originalRed = originalInputArray.red;
    const originalGreen = originalInputArray.green;
    const originalBlue = originalInputArray.blue;

    const Red = inputArray.red;
    const Green = inputArray.green;
    const Blue = inputArray.blue;

    const dataOriginal = JSON.stringify({originalRed, originalGreen, originalBlue})
    const dataToCompress = JSON.stringify({Red, Green, Blue})
    const compressed = lzjs.compressToBase64(dataToCompress);
    const decoded = lzjs.decompressFromBase64(compressed);
    const decodeSize = decoded.length;

    const height = Red.length;
    const width = Red[0].length;

    const originalStats = this.calculateBitsPixels(height, width, originalInputArray);
    const {bits, pixels} = this.calculateBitsPixels(height, width, inputArray);

    const bitsPerSampleOriginal = originalStats.bits / originalStats.pixels;
    const bitsPerSample = bits / pixels;
    const encodedSize = compressed.length;
    const compressionRatio = dataOriginal.length / encodedSize;

    console.log('Compression Ratio:', compressionRatio.toFixed(2));
    console.log('Bits per Sample:', bitsPerSample.toFixed(2));
    console.log('Bits per Sample Original:', bitsPerSampleOriginal.toFixed(2));
  }

  calculateBitsPixels(height, width, inputArray){
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

    return {bits: totalBits, pixels: totalPixels};
  }

}

module.exports = LZEncoder;
