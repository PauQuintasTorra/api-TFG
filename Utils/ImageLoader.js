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
        const binaryData_ = await fs.readFileSync(this.path);
        await fs.writeFileSync(`image.${format}`, binaryData_);
        console.log(format);
        console.log(selected);
        const outputFile = 'example.png';
        const inputFile = 'image.jpg';
        const binaryData = await fs.readFileSync('image.jpg');

        return sharp(binaryData)
        .toFormat('png')
        .toBuffer()
        .then(async jpgData => {
        // Write the JPG data to a file
            fs.writeFileSync(outputFile, jpgData);
            const imagePath = './example.png';
            const image = await fs.readFileSync(imagePath);
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


// switch (type) {
        //     case HEIC:
        //         const readFileAsync = promisify(fs.readFile);
        //         const writeFileAsync = promisify(fs.writeFile);
        //         const inputBuffer = await readFileAsync('image.heic');
        //         const outputBuffer = await heicConvert({
        //             buffer: inputBuffer,
        //             format: 'PNG'
        //           });
        //           await writeFileAsync('image.png', outputBuffer);
        //         break;
        
        //     default:
        //         break;
        // }