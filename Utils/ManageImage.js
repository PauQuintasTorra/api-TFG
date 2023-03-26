const fs = require("fs");
const Jimp = require("jimp");
const { reject } = require("lodash");

class ManageImage {
  constructor(path) {
    this.path = path;
    this.image = {};
    this.height = 0;
    this.width = 0;
  }

  trying() {
    return new Promise((resolve, reject) => {
      Jimp.read(this.path, (err, image) => {
        if (err) throw err;

        // Get the width and height of the image
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        this.width = width;
        this.height = height;

        // Create 2D arrays to store the pixel data for each color channel
        const redChannel = new Array(height);
        const greenChannel = new Array(height);
        const blueChannel = new Array(height);

        for (let y = 0; y < height; y++) {
          // Initialize the arrays for this row
          redChannel[y] = new Array(width);
          greenChannel[y] = new Array(width);
          blueChannel[y] = new Array(width);

          for (let x = 0; x < width; x++) {
            // Get the pixel color at this position
            const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));
            // Store the color values in the corresponding arrays
            redChannel[y][x] = r;
            greenChannel[y][x] = g;
            blueChannel[y][x] = b;
          }
        }

        // Do something with the color channel data
        // console.log("Red channel:", redChannel);
        // console.log('Green channel:', greenChannel);
        // console.log('Blue channel:', blueChannel);
        resolve(redChannel);
      });
    });
  }

  splitArray(array) {
    console.log(this.height, this.width, this.image);
    this.image.red = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      this.image.red[i] = new Array(this.width);
    }
    this.image.blue = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      this.image.blue[i] = new Array(this.width);
    }
    this.image.green = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      this.image.green[i] = new Array(this.width);
    }
    //console.log(this.image.red)

    for (let y = 0; y < this.image.red.length; y++) {
      for (let x = 0; x < this.image.red[y].length; x++) {
        this.image.red[y][x] = array[y][x].red;
        this.image.blue[y][x] = array[y][x].blue;
        this.image.green[y][x] = array[y][x].green;
      }
    }
    //console.log(this.image)
    return this.image;
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
}

module.exports = ManageImage;
