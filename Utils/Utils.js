const math = require('mathjs');
const Jimp = require("jimp");

function trans_abs(matrix){
    for (let x = 0; x < matrix[0].length; x++) {
        for (let y = 0; y < matrix.length; y++) {
            matrix[y][x] = parseInt(math.abs(matrix[y][x]));
        }
    }
    return matrix;
      
}

function normalizeMatrix(matrix){
    
    const max_matrix = math.max(math.flatten(matrix));
    const min_matrix = math.min(math.flatten(matrix));
    if (max_matrix <= 255 && math.abs(min_matrix) <= 255 && min_matrix >= 0) {return matrix}
    else {
        if(max_matrix <= 255 && math.abs(min_matrix) <= 255 && min_matrix < 0){
            return trans_abs(matrix);
        }
        let matrix_abs = trans_abs(matrix);
        const max_matrix_abs = math.max(math.flatten(matrix_abs));

        for (let x = 0; x < matrix_abs[0].length; x++) {
            for (let y = 0; y < matrix_abs.length; y++) {
                matrix_abs[y][x] = math.round((matrix_abs[y][x]/max_matrix_abs) * 255)
            }
        }

        return matrix_abs;
    }
}

async function saveArrayIntoImage(redArray, greenArray, blueArray, nameFile ){
    return new Promise((resolve, reject)=>{
        const returner = JSON.parse(
            JSON.stringify({
              red: redArray,
              green: greenArray,
              blue: blueArray,
            })
        );
      
        const red_ = normalizeMatrix(returner.red);
        const green_ = normalizeMatrix(returner.green);
        const blue_ = normalizeMatrix(returner.blue);
    
        const image = new Jimp(redArray[0].length, redArray.length);
        red_.forEach((row, y) => {
            row.forEach((red, x) => {
            const green = green_[y][x];
            const blue = blue_[y][x];
            const pixelColor = Jimp.rgbaToInt(
                red,
                green,
                blue,
                255
            );
            image.setPixelColor(pixelColor, x, y);
            });
        });
        image.write(nameFile, (err)=>{
            if(err) {reject(err)}
            resolve(nameFile);
        });
    })
}


module.exports = trans_abs;
module.exports = normalizeMatrix;
module.exports = saveArrayIntoImage;