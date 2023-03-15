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

    async exportRAW(format) {
        
        const binaryData = fs.readFileSync(this.path);
        //const bd = this.createImageByFormat(format);
        return sharp(binaryData)
        .toFormat('jpeg')
        .toBuffer()
        .then(jpgData => {
        // Write the JPG data to a file
            fs.writeFileSync('image.jpg', jpgData);
            const imagePath = './image.jpg';
            const image = fs.readFileSync(imagePath);
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