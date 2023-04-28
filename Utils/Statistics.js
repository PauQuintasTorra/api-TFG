const math = require("mathjs");

class Statistics{
    constructor(){}

    getMax(matrix){
        const max_red =  math.max(math.flatten(matrix.red));
        const max_green = math.max(math.flatten(matrix.green));
        const max_blue = math.max(math.flatten(matrix.blue));
        const max_totals = [max_red,max_green,max_blue];
        console.log(max_totals);

        return math.max(math.flatten(max_totals));
    }

    getMin(matrix){
        const min_red =  math.min(math.flatten(matrix.red));
        const min_green = math.min(math.flatten(matrix.green));
        const min_blue = math.min(math.flatten(matrix.blue));
        const min_totals = [min_red,min_green,min_blue];
        console.log(min_totals);

        return math.min(math.flatten(min_totals));
    }

    getMean(){
        const counter = matrix.red[0].length * matrix.red.length;
        let mean = 0;
        for(let x = 0; x < matrix.length; x++){
            for (let y = 0; y < matrix[0].length; y++){
                mean += matrix[y][x];
            }
        }
        mean = mean / counter;
        return mean;
    }

    getVarianze(){
        const counter = matrix.red[0].length * matrix.red.length;
        const mean = this.getMean();
        let varianze = 0;
        for(let x = 0; x < matrix.length; x++){
            for (let y = 0; y < matrix[0].length; y++){
                varianze += (matrix[y][x] - mean)**2;
            }
        }
        varianze = varianze / counter;
        return varianze;
    }

    getEntropyOrderZero(matrix){
        const counter = matrix.red[0].length * matrix.red.length;
        let valors = {};
        let entropy = 0;
        for(let y = 0; y < matrix.length; y++){
            for (let x = 0; x < matrix[0].length; x++){
                if (matrix[y][x] in valors){
                    valors[matrix[y][x]] += 1;
                } else {
                    valors[matrix[y][x]] = 1;
                }
            }
        }
        for (const p in valors) {
            const prob = valors[p] / counter;
            entropy += prob * Math.log2(1 / prob);
        }
        return entropy;
    }

}

module.exports = Statistics;





