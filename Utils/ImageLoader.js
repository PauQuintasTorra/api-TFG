const fs = require('fs');
const sharp = require('sharp');
const { promisify } = require('util');
const heicConvert = require('heic-convert');

class ImageLoader {
    constructor(path) {
        this.path = path;
    }

    createImageByFormat(format){
        const binaryData = fs.readFileSync(this.path);
        fs.writeFileSync(`image.${format}`, binaryData);
        return binaryData;
    }

    async exportRAW(format, selected) {
        const binaryDataFront = await fs.readFileSync(this.path);
        await fs.writeFileSync(`image.${format}`, binaryDataFront);
        const outputFile = `example.${selected}`;
        const inputFile = `image.${format}`;

        const binaryData = await fs.readFileSync(inputFile);

        return sharp(binaryData)
        .toFormat('png')
        .toBuffer()
        .then(async jpgData => {
        // Write the JPG data to a file
            fs.writeFileSync(outputFile, jpgData);
            const image = await fs.readFileSync(`./${outputFile}`);
            const base64Image = Buffer.from(image).toString('base64');
            return ({ image: base64Image });
        })
        .catch(err => {
            console.error(err);
        });
    }

    extractFormat(name){
        const result = name.split('.');
        return result[result.length - 1].toString().toLowerCase();
    }

}

module.exports = ImageLoader;
