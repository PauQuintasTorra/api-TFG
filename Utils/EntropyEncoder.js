const zlib = require('zlib');

const fs = require("fs");

class EntropyEncoder{

    constructor(){}

    async codificacioZlib(h, w){
        const filename = 'final_result.jpg';

        // datos de imagen sin comprimir
        const imageData = fs.readFileSync(filename);
        
        // datos de imagen comprimidos
        const compressedImageData = zlib.deflateSync(imageData);
        
        // cantidad de bytes de la imagen sin comprimir
        const uncompressedSize = imageData.length;
        
        // cantidad de bytes de la imagen comprimida
        const compressedSize = compressedImageData.length;
        
        // ratio de compresión
        const compressionRatio = uncompressedSize / compressedSize;
        
        // ancho y alto de la imagen
        const width = w;
        const height = h;
        
        // cantidad total de bits por píxel
        const bitsPerPixel = 24;
        
        // cantidad total de bits por muestra
        const bitsPerSample = bitsPerPixel / 3;
        
        // cantidad total de bits utilizados para representar la imagen sin comprimir
        const uncompressedTotalBits = width * height * bitsPerPixel;
        
        // cantidad total de bits utilizados para representar la imagen comprimida
        const compressedTotalBits = compressedSize * 8;
        
        // bits por muestra de la imagen
        const bitsPerSampleUncompressed = uncompressedTotalBits / (width * height * 3);
        const bitsPerSampleCompressed = compressedTotalBits / (width * height * 3);
        
        console.log(`Bits por muestra sin comprimir: ${bitsPerSampleUncompressed}`);
        console.log(`Bits por muestra comprimido: ${bitsPerSampleCompressed}`);
        console.log(`Ratio de compresión: ${compressionRatio}`);
    }

}

module.exports = EntropyEncoder;