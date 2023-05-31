const fs = require("fs");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const XLSX = require('xlsx');

class DownloaderFromJson {
  constructor() {}

  async mainDownloader(format, filePath) {

    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    //console.log(jsonData);
    switch (format) {
      case 'xlsx':
        function flattenObject(obj, headers = {}, prefix = '') {
          const flattened = {};
        
          for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {        
              const nestedObj = flattenObject(obj[key], headers, `${prefix}${key}.`);
              Object.assign(flattened, nestedObj);
            } else {
                console.log(`PREFIX: ${prefix}`);
                console.log(`CLAU: ${key}`)
                flattened[`${prefix}${key}`] = obj[key];
                switch (`${key}`) {
                  case 'nameImage':
                    headers[`${prefix}${key}`] = `Nom del fitxer`;
                    break;
                  case 'timestamp':
                    headers[`${prefix}${key}`] = `Identificador`;
                    break;
                  case `type`:
                    headers[`${prefix}${key}`] = `Tipus de classe`;
                    break;
                  case `waveletType`:
                    headers[`${prefix}${key}`] = `Tipus de transformada Wavelet`;
                    break;
                  case `waveletLevel`:
                    headers[`${prefix}${key}`] = `Nivell de transformada Wavelet`;
                    break;
                  case `max`:
                    headers[`${prefix}${key}`] = `Màxim`;
                    break;
                  case `min`:
                    headers[`${prefix}${key}`] = `Mínim`;
                    break;
                  case `entropy`:
                    headers[`${prefix}${key}`] = `Entropia`;
                    break;
                  case `mean`:
                    headers[`${prefix}${key}`] = `Mitjana`;
                    break;
                  case `varianze`:
                    headers[`${prefix}${key}`] = `Variança`;
                    break;
                    case `q_step`:
                    headers[`${prefix}${key}`] = `Pas de quantització`;
                    break;
                  case `encoderType`:
                    headers[`${prefix}${key}`] = `Tipus de codificador per entropia`;
                    break;
                  case `compressionRatio`:
                    headers[`${prefix}${key}`] = `Ratio de compressió`;
                    break;
                  case `bitsPerSample`:
                    headers[`${prefix}${key}`] = `Bits per mostra (imatge comprimida)`;
                    break;
                  case `bitsPerSampleOriginal`:
                    headers[`${prefix}${key}`] = `Bits per mostra (imatge original)`;
                    break;
                  case `finalBitsPerSample`:
                    headers[`${prefix}${key}`] = `Bits per mostra (imatge modificada)`;
                    break;
                  case `psnr`:
                    headers[`${prefix}${key}`] = `"Peak Signal to Noise Ratio"`;
                    break;
                  case `pae`:
                    headers[`${prefix}${key}`] = `"Peak Absolute Erorr"`;
                    break;
                  case `mse`:
                    headers[`${prefix}${key}`] = `"Mean Square Error"`;
                    break;
                  case `operationType`:
                    headers[`${prefix}${key}`] = `Tipus d'operació`;
                    break;
                  case `operationNumber`:
                    headers[`${prefix}${key}`] = `Valor a operar`;
                    break;

                  default:
                    headers[`${prefix}${key}`] = `No existeix`;
                    break;
                }
              
              
            }
          }
        
          return flattened;
        }
        
        // Create an empty object to store custom header names
        const customHeaders = {};
        
        // Flatten each object in the JSON array and collect custom headers
        const flattenedData = jsonData.map(obj => flattenObject(obj, customHeaders));
        
        // Convert flattened data to worksheet
        const rows = flattenedData.map(obj => Object.values(obj));
        const headerRow = Object.values(customHeaders);
        const worksheetData = [headerRow, ...rows];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        
        // Create a new workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
        // Generate Excel file binary data
        const excelData = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        
        // Save Excel file
        fs.writeFileSync('output.xlsx', excelData);
        
        console.log('Excel file created successfully!');
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
