const jsonexport = require('jsonexport');
const fs = require("fs");

class DownloaderFromJson {
  constructor() {}

  async mainDownloader(format, filePath) {
    let retu;
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    switch (format) {
      case 'xlsx':
        retu = 'Xlsx';
        break;

      case 'csv':
        retu = await jsonexport(jsonData);
        break;

      case 'json':
        retu = 'json';
        break;

    }

    return retu; 
  }

  
}

module.exports = DownloaderFromJson;
