const math = require("mathjs");
const Jimp = require("jimp");
const normalizeMatrix = require("./Utils");

class Quantizer{
    constructor(q_step){
        this.inputArray = {};
        this.q_step = q_step;
    }

    mainQuantize(inputArray, formatImage) {
        this.inputArray = inputArray;

        const quan_red = this.quantize(inputArray.red);
        const quan_green = this.quantize(inputArray.green);
        const quan_blue = this.quantize(inputArray.blue);
    
        // Create a new Jimp image with the same dimensions as the input array
        const image = new Jimp(quan_red[0].length, quan_red.length);
    
        // Iterate over the input arrays and set the color of each pixel in the image
        quan_red.forEach((row, y) => {
          row.forEach((red, x) => {
            const green = quan_green[y][x];
            const blue = quan_blue[y][x];
            const pixelColor = Jimp.rgbaToInt(math.abs(red), math.abs(green), math.abs(blue), 255);
            image.setPixelColor(pixelColor, x, y);
          });
        });
        // Save the image as a JPEG file
        image.write(`quantizer_${this.q_step}.${formatImage}`);
        return {red: quan_red, green: quan_green, blue: quan_blue};
    }

    mainDequantize(inputArray, formatImage) {
        this.inputArray = inputArray;
        const dequan_red = this.dequantize(inputArray.red);
        const dequan_green = this.dequantize(inputArray.green);
        const dequan_blue = this.dequantize(inputArray.blue);
        
        const returner = JSON.parse(JSON.stringify({red: dequan_red, green: dequan_green, blue: dequan_blue}));

        const red_ = normalizeMatrix(returner.red);
        const green_ = normalizeMatrix(returner.green);
        const blue_ = normalizeMatrix(returner.blue);

        // Create a new Jimp image with the same dimensions as the input array
        const image = new Jimp(dequan_red[0].length, dequan_blue.length);
    
        // Iterate over the input arrays and set the color of each pixel in the image
        red_.forEach((row, y) => {
          row.forEach((red, x) => {
            const green = green_[y][x];
            const blue = blue_[y][x];
            const pixelColor = Jimp.rgbaToInt(math.abs(red), math.abs(green), math.abs(blue), 255);
            image.setPixelColor(pixelColor, x, y);
          });
        });
        // Save the image as a JPEG file
        image.write(`dequantizer_${this.q_step}.${formatImage}`);
        return {red: dequan_red, green: dequan_green, blue: dequan_blue};
    }


    quantize(matrix){
        for(let y = 0; y < matrix.length; y++){
            for(let x = 0; x < matrix[0].length; x++){
                const abs_number = matrix[y][x];
                const number = Math.floor(abs_number / this.q_step);
                if (matrix[y][x] != 0){
                    matrix[y][x] = number * parseInt( Math.floor(abs_number / matrix[y][x]));
                } else{
                    matrix[y][x] = 0;
                }
            }
        }
        return matrix;
    }

    dequantize(matrix){
        for(let y = 0; y < matrix.length; y++){
            for(let x = 0; x < matrix[0].length; x++){
                matrix[y][x] = parseInt(matrix[y][x] * this.q_step);
            }
        }
        return matrix;
    }

}

module.exports = Quantizer;
    
                       



