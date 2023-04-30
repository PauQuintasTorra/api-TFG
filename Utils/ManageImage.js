const fs = require("fs");
const Jimp = require("jimp");
const { reject } = require("lodash");

class ManageImage {
  constructor(path) {
    this.path = path;
    this.height = 0;
    this.width = 0;
  }

  pathToArrayRGB() {
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

        resolve({ red: redChannel, green: greenChannel, blue: blueChannel });
      });
    });
  }

  extractFormat(name) {
    const result = name.split(".");
    return result[result.length - 1].toString().toLowerCase();
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
}

module.exports = ManageImage;
