const fs = require('fs');
const sharp = require('sharp');

class ImageLoader {
    constructor() {}

    exportRAW(path) {
        const binaryData = fs.readFileSync(path);
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

}

module.exports = ImageLoader;