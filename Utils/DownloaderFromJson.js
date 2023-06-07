const fs = require("fs");
const { Parser } = require('json2csv');
const XLSX = require('xlsx');

class DownloaderFromJson {
  constructor() {}

  async mainDownloader(format, filePath) {

    const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

    switch (format) {
      case 'xlsx':
        function flattenObject(obj, headers = {}, prefix = '') {
          const flattened = {};
        
          for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {        
              const nestedObj = flattenObject(obj[key], headers, `${prefix}${key}.`);
              Object.assign(flattened, nestedObj);
            } else {
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
                    headers[`${prefix}${key}`] = `Tipus`;
                    break;
                  case `waveletLevel`:
                    headers[`${prefix}${key}`] = `Valor`;
                    break;
                  case `operationNumber`:
                    headers[`${prefix}${key}`] = `Valor`;
                    break;
                  case `q_step`:
                    headers[`${prefix}${key}`] = `Valor`;
                    break;
                  case `encoderValue`:
                    headers[`${prefix}${key}`] = `Valor`;
                    break;
                  case `value`:
                    headers[`${prefix}${key}`] = `Valor`;
                    break;
                  case `quantizerType`:
                    headers[`${prefix}${key}`] = `Tipus`;
                    break;
                  case `encoderType`:
                    headers[`${prefix}${key}`] = `Tipus`;
                    break;
                  case `operationType`:
                    headers[`${prefix}${key}`] = `Tipus`;
                    break;
                  case `class`:
                    headers[`${prefix}${key}`] = `Tipus`;
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
                  default:
                    console.log(`${key}, ${prefix}`)
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
        fs.writeFile(filePath, excelData, ()=>{
          console.log('Excel file created successfully!');
        });
        return excelData;
        break;

      case 'csv':
        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(jsonData);

        // Write CSV data to a file
        fs.writeFile(filePath, csvData, ()=>{
          console.log("IT WORKS!");
        });
        return csvData;
        break;

      case 'json':
        return jsonData;
        break;

    }

  }

  
}

module.exports = DownloaderFromJson;
