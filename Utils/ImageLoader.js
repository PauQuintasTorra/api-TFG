const fs = require("fs");
const sharp = require("sharp");
const Jimp = require("jimp");
const { reject } = require("lodash");
const normalizeMatrix = require("./Utils");
const saveArrayIntoImage = require("./Utils");

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

  async exportInputArray(inputArray, name) {
    return new Promise((resolve, reject) => {
      saveArrayIntoImage(inputArray.red, inputArray.green, inputArray.blue, name).then((name)=>{
        resolve(name);
      });
    });
  }

  async getReadyToSend(name, formatSelected) {
    let outputFile = `send_${name}.${formatSelected}`;
    if(name == `final_result.${formatSelected}`) {
      outputFile = `send_${name}.${formatSelected}`;
    }
    const binaryData = await fs.readFileSync(`${name}.${formatSelected}`);

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
