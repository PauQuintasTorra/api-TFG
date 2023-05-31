const fs = require("fs");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class DownloaderFromJson {
  constructor() {}

  async mainDownloader(format, filePath) {

    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(jsonData);
    switch (format) {
      case 'xlsx':

        break;

      case 'csv':
        const csvWriter = createCsvWriter({
          path: 'data.csv',
          header: [
            {id: 'nameImage', title: 'Nom del fitxer'},
            {id: 'timestamp', title: 'Identificador'},
            {id: 'progress', title: 'Procés'},
            {id: 'initStats', title: 'Estadístiques inicials'},
            {id: 'entropyStats', title: "Estadístiques sobre l'entropia"},
            {id: 'finalStats', title: 'Estadístiques finals'},
            {id: 'progress.class.type', title: 'Tipus de classe'},
            {id: 'progress.class.waveletType', title: 'Tipus de transformada Wavelet'},
            {id: 'progress.class.waveletLevel', title: 'Nivell de transformada Wavelet'},
            {id: 'progress.max', title: 'Màxim'},
            {id: 'progress.min', title: 'Mínim'},
            {id: 'progress.entropy', title: 'Entropia'},
            {id: 'progress.varianze', title: 'Variança'},
            {id: 'progress.mean', title: 'Mitjana'},
            {id: 'progress.class.q_step', title: 'Pas de quantització'},
            {id: 'initStats.max', title: 'Màxim'},
            {id: 'initStats.min', title: 'Mínim'},
            {id: 'initStats.entropy', title: 'Entropia'},
            {id: 'initStats.varianze', title: 'Variança'},
            {id: 'initStats.mean', title: 'Mitjana'},
            {id: 'progress.class.encoderType', title: 'Tipus de codificador per entropia'},
            {id: 'entropyStats.compressionRatio', title: 'Ratio de compressió'},
            {id: 'entropyStats.bitsPerSample', title: 'Bits per mostra (imatge comprimida)'},
            {id: 'entropyStats.bitsPerSampleOriginal', title: 'Bits per mostra (imatge original)'},
            {id: 'entropyStats.finalBitsPerSample', title: 'Bits per mostra (imatge modificada)'},
            {id: 'finalStats.psnr', title: '"Peak Signal to Noise Ratio"'},
            {id: 'finalStats.pae', title: '"Peak Absolute Erorr"'},
            {id: 'finalStats.mse', title: '"Mean Square Error"'},
            {id: 'progress.class.operationType', title: "Tipus d'operació"},
            {id: 'progress.class.operationNumber', title: 'Valor a operar'},
          ],
        });
        csvWriter.writeRecords(data).then(()=>{
          console.log("IT WORKS!")
        });
        break;

      case 'json':
        break;

    }


  }

  
}

module.exports = DownloaderFromJson;
