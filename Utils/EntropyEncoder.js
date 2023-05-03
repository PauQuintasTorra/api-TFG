const zlib = require('zlib');

class EntropyEncoder{

    constructor(){}

    codificacioZlib(inputArray){
        const matrix = [inputArray.red, inputArray.green, inputArray.blue]
        const flattenedMatrix = matrix.flat(2);

        console.log(flattenedMatrix)
        const matrixString = JSON.stringify(flattenedMatrix);

        zlib.deflate(matrixString, (err, compressedData) => {
        if (err) {
            console.log("aaa")
            console.error(err);
            return "nova";
        }

        console.log(compressedData)
        const compressionRatio = compressedData.length / matrixString.length;
        console.log(`Compression ratio: ${compressionRatio}`);

        const bitsPerSample = compressedData.length * 8 / (flattenedMatrix.length * flattenedMatrix[0].length);
        console.log(`Bits per sample: ${bitsPerSample}`);

        return {ratio: compressionRatio, bps: bitsPerSample }
        });
    }

}

module.exports = EntropyEncoder;