const math = require("mathjs");
const Jimp = require("jimp");

class ArithmeticOperation{
    constructor(value){ 
        this.value = value;
    }

    mainAddValue(inputArray, formatImage) {
        this.inputArray = inputArray;

        const add_red = this.addValue(inputArray.red);
        const add_green = this.addValue(inputArray.green);
        const add_blue = this.addValue(inputArray.blue);
        
        // Create a new Jimp image with the same dimensions as the input array
        const image = new Jimp(add_red[0].length, add_red.length);
    
        // Iterate over the input arrays and set the color of each pixel in the image
        add_red.forEach((row, y) => {
          row.forEach((red, x) => {
            const green = add_green[y][x];
            const blue = add_blue[y][x];
            const pixelColor = Jimp.rgbaToInt(red, green, blue, 255);
            image.setPixelColor(pixelColor, x, y);
          });
        });
        // Save the image as a JPEG file
        image.write(`add_${this.value}.${formatImage}`);
        return {red: add_red, green: add_green, blue: add_blue};
    }

    addValue(matrix){
        for(let y = 0; y < matrix.length; y++){
            for(let x = 0; x < matrix[0].length; x++){
                const number = matrix[y][x] + this.value;
                if(number > 255) {matrix[y][x] = 255}
                else {matrix[y][x] = number}
            }
        }
        return matrix;
    }

    mainSubstractValue(inputArray, formatImage) {
        this.inputArray = inputArray;

        const sub_red = this.substractValue(inputArray.red);
        const sub_green = this.substractValue(inputArray.green);
        const sub_blue = this.substractValue(inputArray.blue);
        
        // Create a new Jimp image with the same dimensions as the input array
        const image = new Jimp(sub_red[0].length, sub_red.length);
    
        // Iterate over the input arrays and set the color of each pixel in the image
        sub_red.forEach((row, y) => {
          row.forEach((red, x) => {
            const green = sub_green[y][x];
            const blue = sub_blue[y][x];
            const pixelColor = Jimp.rgbaToInt(red, green, blue, 255);
            image.setPixelColor(pixelColor, x, y);
          });
        });
        // Save the image as a JPEG file
        image.write(`substract_${this.value}.${formatImage}`);
        return {red: sub_red, green: sub_green, blue: sub_blue};
    }

    substractValue(matrix){
        for(let y = 0; y < matrix.length; y++){
            for(let x = 0; x < matrix[0].length; x++){
                const number = matrix[y][x] - this.value;
                if(number < 0) {matrix[y][x] = 0}
                else {matrix[y][x] = number}
            }
        }
        return matrix;
    }

    mainMultiplyValue(inputArray, formatImage) {
        this.inputArray = inputArray;

        const mul_red = this.multiplyValue(inputArray.red);
        const mul_green = this.multiplyValue(inputArray.green);
        const mul_blue = this.multiplyValue(inputArray.blue);
        
        // Create a new Jimp image with the same dimensions as the input array
        const image = new Jimp(mul_red[0].length, mul_red.length);
    
        // Iterate over the input arrays and set the color of each pixel in the image
        mul_red.forEach((row, y) => {
          row.forEach((red, x) => {
            const green = mul_green[y][x];
            const blue = mul_blue[y][x];
            const pixelColor = Jimp.rgbaToInt(red, green, blue, 255);
            image.setPixelColor(pixelColor, x, y);
          });
        });
        // Save the image as a JPEG file
        image.write(`multiply_${this.value}.${formatImage}`);
        return {red: mul_red, green: mul_green, blue: mul_blue};
    }

    multiplyValue(matrix){
        for(let y = 0; y < matrix.length; y++){
            for(let x = 0; x < matrix[0].length; x++){
                const number = matrix[y][x] * this.value;
                if(number > 255) {matrix[y][x] = 255}
                else {matrix[y][x] = number}
            }
        }
        return matrix;
    }

    mainDivideValue(inputArray, formatImage) {
        this.inputArray = inputArray;

        const div_red = this.divideValue(inputArray.red);
        const div_green = this.divideValue(inputArray.green);
        const div_blue = this.divideValue(inputArray.blue);
        
        // Create a new Jimp image with the same dimensions as the input array
        const image = new Jimp(div_red[0].length, div_red.length);
    
        // Iterate over the input arrays and set the color of each pixel in the image
        div_red.forEach((row, y) => {
          row.forEach((red, x) => {
            const green = div_green[y][x];
            const blue = div_blue[y][x];
            const pixelColor = Jimp.rgbaToInt(red, green, blue, 255);
            image.setPixelColor(pixelColor, x, y);
          });
        });
        // Save the image as a JPEG file
        image.write(`divide_${this.value}.${formatImage}`);
        return {red: div_red, green: div_green, blue: div_blue};
    }

    divideValue(matrix){
        for(let y = 0; y < matrix.length; y++){
            for(let x = 0; x < matrix[0].length; x++){
                if(matrix[y][x] == 0 || this.value == 0) {matrix[y][x] = 0}
                else {matrix[y][x] = parseInt(matrix[y][x] / this.value);}
            }
        }
        return matrix;
    }
}

module.exports = ArithmeticOperation;
    
                       



