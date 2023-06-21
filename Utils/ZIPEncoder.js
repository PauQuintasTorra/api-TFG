const AdmZip = require("adm-zip");
const ManageImage = require("./ManageImage");

class ZIPEncoder {
  constructor() {}

  async mainprova(originalInputArray, inputArray, xToCut, yToCut, initialEntropy, lastEntropy) {
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

    const Red = finalResult.red;
    const Green = finalResult.green;
    const Blue = finalResult.blue;


    const dataToCompress = JSON.stringify({ Red, Green, Blue });

    const zip = new AdmZip();
    await zip.addFile("compressZip.json", Buffer.from(dataToCompress));
    const compressedBuffer = zip.toBuffer();

    const unzip = new AdmZip(compressedBuffer);
    const decompressedBuffer = await unzip.readFile("compressZip.json");

    return initialEntropy / lastEntropy;
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

module.exports = ZIPEncoder;
