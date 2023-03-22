const fs = require('fs');
const Jimp = require('jimp');
const { reject } = require('lodash');

class ManageImage{
  constructor(path) {
      this.path = path;
      this.image = {};
      this.height = 0;
      this.width = 0;
  }

  trying() {
    return new Promise((resolve,reject) =>{
      Jimp.read(this.path, (err, image) => {
          if (err) throw err;
        
          // Get the width and height of the image
          const width = image.bitmap.width;
          const height = image.bitmap.height;

          this.width = width;
          this.height = height;
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
          // Do something with the 2D array of pixels
          //console.log(pixelArray);
          resolve(pixelArray);
        });
    }) 
  }

  splitArray(array) {
    console.log(this.height,this.width,this.image)
    this.image.red = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      this.image.red[i] = new Array(this.width);
    }
    console.log(this.image.red)

    for(let y = 0; y < this.image.red.length; y++){
      for(let x = 0; x < this.image.red[y].length; x++){
        this.image.red[y][x] = array[y][x].red;
      } 
    }
    console.log(this.image)
    return this.image;
  }
}

module.exports = ManageImage;
