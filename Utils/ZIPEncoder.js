const AdmZip = require("adm-zip");

class ZIPEncoder {
  constructor() {}

  async mainprova(originalInputArray, inputArray){
    const originalRed = originalInputArray.red;
    const originalGreen = originalInputArray.green;
    const originalBlue = originalInputArray.blue;

    const Red = inputArray.red;
    const Green = inputArray.green;
    const Blue = inputArray.blue;

    const dataOriginal = JSON.stringify({originalRed, originalGreen, originalBlue});
    const dataToCompress = JSON.stringify({Red, Green, Blue});

    const zip = new AdmZip();
    await zip.addFile('compressZip.json', Buffer.from(dataToCompress));
    const compressedBuffer = zip.toBuffer();
    const compressed = compressedBuffer.toString('base64');

    const unzip = new AdmZip(compressedBuffer);
    const decompressedBuffer = await unzip.readFile('compressZip.json');
    const decoded = decompressedBuffer.toString();
    
    const decodeSize = decoded.length;

    const height = Red.length;
    const width = Red[0].length;

    const originalStats = this.calculateBitsPixels(height, width, originalInputArray);
    const {bits, pixels} = this.calculateBitsPixels(height, width, inputArray);

    const bitsPerSampleOriginal = originalStats.bits / originalStats.pixels;
    const bitsPerSample = bits / pixels;
    const encodedSize = compressed.length;
    const compressionRatio = dataOriginal.length / encodedSize;

    return {compressionRatio: compressionRatio, bitsPerSample: bitsPerSample, bitsPerSampleOriginal: bitsPerSampleOriginal};
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

module.exports = ZIPEncoder;
