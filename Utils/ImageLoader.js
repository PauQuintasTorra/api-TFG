const fs = require("fs");
const sharp = require("sharp");
const Jimp = require("jimp");
const { reject } = require("lodash");

class ImageLoader {
  constructor() {}

  async exportRAW(format, selected) {
    const binaryDataFront = await fs.readFileSync(this.path);
    await fs.writeFileSync(`image.${format}`, binaryDataFront);
    const outputFile = `example.${selected}`;
    const inputFile = `image.${format}`;

    const binaryData = await fs.readFileSync(inputFile);

    return sharp(binaryData)
      .toFormat(selected)
      .toBuffer()
      .then(async (Data) => {
        // Write the JPG data to a file
        fs.writeFileSync(outputFile, Data);
        const image = await fs.readFileSync(`./${outputFile}`);
        const base64Image = Buffer.from(image).toString("base64");
        return { image: base64Image };
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async exportInputArray(inputArray, formatOriginal) {
    return new Promise((resolve, reject) => {
      const image = new Jimp(inputArray.red[0].length, inputArray.red.length);

      inputArray.red.forEach((row, y) => {
        row.forEach((red, x) => {
          const green = inputArray.green[y][x];
          const blue = inputArray.blue[y][x];
          const pixelColor = Jimp.rgbaToInt(red, green, blue, 255);
          image.setPixelColor(pixelColor, x, y);
        });
      });
      // Save the image as a JPEG file
      image.write(`final_result.${formatOriginal}`, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(`final_result.${formatOriginal}`);
        }
      });
    });
  }

  async getReadyToSend(name, formatSelected) {
    const outputFile = `final_result_front.${formatSelected}`;
    const binaryData = await fs.readFileSync(name);

    return sharp(binaryData)
      .toFormat(formatSelected)
      .toBuffer()
      .then(async (Data) => {
        // Write the JPG data to a file
        await fs.writeFileSync(`${outputFile}`, Data);
        const image = await fs.readFileSync(`${outputFile}`);
        const base64Image = Buffer.from(image).toString("base64");
        return { image: base64Image };
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

module.exports = ImageLoader;
