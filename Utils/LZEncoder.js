const lzjs = require('lzjs');
const fs = require('fs');

class LZEncoder {
  constructor() {}

  async mainprova(name, w, h){
    const imageData = fs.readFileSync(name);

    const compressed = lzjs.compressToBase64(imageData);
    const decoded = lzjs.decompressFromBase64(compressed);

    const originalSize = fs.statSync(name).size;
    const encodedSize = compressed.length;
    const decodedSize = decoded.length;
    const compressionRatio = originalSize / encodedSize;

    const width = w;
    const height = h;
    const totalPixels = width * height * 3;
    const totalBits = encodedSize * 24;
    const totalBitsOriginal = decodedSize * 24;
    const bitsPerSample = totalBits / totalPixels;
    const bitsPerSampleOriginal = totalBitsOriginal / totalPixels;

    console.log('Compression Ratio:', compressionRatio.toFixed(2));
    console.log('Bits per Sample:', bitsPerSample.toFixed(2));
    console.log('Bits per Sample Original:', bitsPerSampleOriginal.toFixed(2));
  }
}

module.exports = LZEncoder;