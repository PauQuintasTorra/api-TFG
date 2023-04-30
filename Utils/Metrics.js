const math = require("mathjs");

class Metrics{
    constructor(){}

    getMSE_RGB(inputArray, originalArray){
        const mse_red = this.getMSE(inputArray.red, originalArray.red);
        const mse_green = this.getMSE(inputArray.green, originalArray.green);
        const mse_blue = this.getMSE(inputArray.blue, originalArray.blue);

        return (mse_red + mse_green + mse_blue) / 3;
    }

    getPSNR_RGB(inputArray, originalArray){
        const psnr_red = this.getPSNR(inputArray.red, originalArray.red);
        const psnr_green = this.getPSNR(inputArray.green, originalArray.green);
        const psnr_blue = this.getPSNR(inputArray.blue, originalArray.blue);

        return (psnr_red + psnr_green + psnr_blue) / 3;
    }

    getPAE_RGB(inputArray, originalArray){
        const pae_red = this.getPAE(inputArray.red, originalArray.red);
        const pae_green = this.getPAE(inputArray.green, originalArray.green);
        const pae_blue = this.getPAE(inputArray.blue, originalArray.blue);
        const max_totals = [pae_red,pae_green,pae_blue];

        return math.max(max_totals)
    }

    getMSE(matrix, original){
        let MSE = 0;
        const counter = matrix.length * matrix[0].length;
        for(let y = 0; y < matrix.length; y++){
            for (let x = 0; x < matrix[0].length; x++){
                MSE += (original[y][x] - matrix[y][x])**2;
            }
        }
        MSE = MSE / counter;
        return MSE;
    }

    getPSNR(matrix, original){
        const MSE = this.getMSE(matrix,original);
        if(MSE === 0) {return 0}
        else{
            for(let y = 0; y < matrix.length; y++){
                for (let x = 0; x < matrix[0].length; x++){
                    const num_of_bits = math.ceil(math.log2(math.max(...original[0])));
                    return 10*math.log10(math.pow((2**num_of_bits - 1), 2) / MSE);
                }
            }
        }
        
    }

    getPAE(matrix, original){
        let PAE = 0;
        for(let y = 0; y < matrix.length; y++){
            for (let x = 0; x < matrix[0].length; x++){
                let value = math.abs(original[y][x] - matrix[y][x]) 
                if (PAE < value) {
                    PAE = value;
                }
            }
        }
        return PAE;
    }

}

module.exports = Metrics;





