const math = require("mathjs");

class Statistics{
    constructor(matrix){
        this.matrix = matrix;
        this.counter = this.matrix[0].length * this.matrix.length;
    }

    getMax(){
        return math.max(math.flatten(this.matrix));
    }

    getMin(){
        return math.min(math.flatten(this.matrix));
    }

    getMean(){
        let mean = 0;
        for(let x = 0; x < this.matrix.length; x++){
            for (let y = 0; y < this.matrix[0].length; y++){
                mean += this.matrix[y][x];
            }
        }
        mean = mean / this.counter;
        return mean;
    }

    getVarianze(){
        const mean = this.getMean();
        let varianze = 0;
        for(let x = 0; x < this.matrix.length; x++){
            for (let y = 0; y < this.matrix[0].length; y++){
                varianze += (this.matrix[y][x] - mean)**2;
            }
        }
        varianze = varianze / this.counter;
        return varianze;
    }

    getEntropyOrderZero(){
        let valors = {};
        let entropy = 0;
        for(let y = 0; y < this.matrix.length; y++){
            for (let x = 0; x < this.matrix[0].length; x++){
                if (this.matrix[y][x] in valors){
                    valors[this.matrix[y][x]] += 1;
                } else {
                    valors[this.matrix[y][x]] = 1;
                }
            }
        }
        for (const p in valors) {
            const prob = valors[p] / this.counter;
            entropy += prob * Math.log2(1 / prob);
        }
        return entropy;
    }

}

module.exports = Statistics;





