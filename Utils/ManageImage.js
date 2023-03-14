const fs = require('fs');
const Jimp = require('jimp');
const { reject } = require('lodash');

module.exports = function trying(path) {
    console.log("AAAAAAAAAAAAA");
    return new Promise((resolve,reject) =>{
        Jimp.read(path, (err, image) => {
            if (err) throw err;
          
            // Get the width and height of the image
            const width = image.bitmap.width;
            const height = image.bitmap.height;
            console.log("AAAAAAAAAAAAA");
            // Create a 2D array with the same dimensions as the image
            const pixelArray = new Array(height);
            for (let i = 0; i < height; i++) {
              pixelArray[i] = new Array(width);
            }
          
            // Iterate over each pixel in the image and add it to the array
            image.scan(0, 0, width, height, (x, y, idx) => {
              const red = image.bitmap.data[idx + 0];
              const green = image.bitmap.data[idx + 1];
              const blue = image.bitmap.data[idx + 2];
              const alpha = image.bitmap.data[idx + 3];
          
              // Add the pixel to the array
              pixelArray[y][x] = { red, green, blue, alpha };
            });
          console.log("AAAAAAAAAAAAA");
            // Do something with the 2D array of pixels
            //console.log(pixelArray);
            resolve(pixelArray);
          });
    }) 
}
