const HuffmanEncoder = require('huffman-encoder');
class EntropyEncoder {
  constructor() {}

  main(inputArray){


    const shape = [inputArray.red.length, inputArray.red[0].length];
    const { compressedData, compressionRatio, bitsPerSample } = this.compressData(originalData);
    console.log('Datos comprimidos:', compressedData);
    console.log('Ratio de compresión:', compressionRatio.toFixed(2));
    console.log('Bits por muestra:', bitsPerSample.toFixed(2));


  }
  compressData(data) {
    const flattenedData = data.flat();

    const frequencies = this.calculateFrequencies(flattenedData);

    const huffmanTree = HuffmanEncoder.buildTree(frequencies);

    const huffmanCodes = HuffmanEncoder.getCodes(huffmanTree);

    const compressedData = flattenedData.map(value => huffmanCodes[value]).join('');

    // Calcular el tamaño en bits de los datos originales y comprimidos
    const originalSize = flattenedData.length * 8; // Suponiendo que cada valor ocupa 8 bits
    const compressedSize = compressedData.length;

    // Calcular el ratio de compresión
    const compressionRatio = originalSize / compressedSize;

    // Calcular los bits por muestra
    const bitsPerSample = compressedSize / flattenedData.length;

    return {
      compressedData,
      compressionRatio,
      bitsPerSample,
    };
  }

  descompressData(compressedData, huffmanTree, shape) {
    const decodedData = HuffmanEncoder.decode(compressedData, huffmanTree);

    // Convertir la matriz 1D en una matriz 2D utilizando la forma original
    const data = [];
    let dataIndex = 0;
  
    for (let i = 0; i < shape[0]; i++) {
      const row = [];
      for (let j = 0; j < shape[1]; j++) {
        row.push(decodedData[dataIndex]);
        dataIndex++;
      }
      data.push(row);
    }
  
    return data;
  }

  calculateFrequencies(data){
    const frequencies = {};

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      frequencies[value] = (frequencies[value] || 0) + 1;
    }

    return frequencies;
  }

  async descodificacioZipCompress(originalSize, w, h) {
   
  }

  returnerZipFinalImage(){

  }
}

module.exports = EntropyEncoder;
