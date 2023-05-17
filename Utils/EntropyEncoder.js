const AdmZip = require("adm-zip");
const jimp = require("jimp");
const sharp = require('sharp');

const fs = require("fs");
const { reject } = require("lodash");
const { resolve } = require("path");

class EntropyEncoder {
  constructor() {}

  codificacioZipCompress(name) {
    return new Promise((resolve, reject) => {
      const imagePath = name;
      const zipPath = "final_image_compress.zip";
      const zip = new AdmZip();

      fs.readFile(imagePath,(err, imageData)=>{
        if(err) {
          console.log(err);
          reject(err);
          return;
        }
        
        zip.addFile(name, imageData);
        
        try {
          zip.writeZip(zipPath, (err) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log("Image compressed and zipped successfully!");
              resolve();
            }
          });
        } catch (err) {
          reject(err);
        }
        
      });
      
    });
  }

  async descodificacioZipCompress(originalSize, w, h) {
    const zipPath = "final_image_compress.zip";

    // Read the ZIP archive data
    const zipData = fs.readFileSync(zipPath);

    console.log("zipdata: ", zipData);
    // Create a new instance of AdmZip using the ZIP archive data
    const zip = new AdmZip(zipData);

    // Get the entries/files in the ZIP archive
    const entries = zip.getEntries();

    // Assuming the ZIP archive contains only one file (the image file)
    if (entries.length === 1) {
      const imageEntry = entries[0];
      // Get the uncompressed image data as a Buffer
      const imageData = imageEntry.getData();

      // Calculate the compression ratio
      const compressedSize = imageEntry.header.compressedSize;
      const uncompressedSize = originalSize;
      console.log(compressedSize, uncompressedSize);

      const compressionRatio = uncompressedSize / compressedSize;

      // Calculate the bits per sample
      const bitsPerSample = (compressedSize * 24) / (w * h * 3);
      const bitsPerSampleOriginal = (uncompressedSize * 24) / (w * h * 3);

      console.log("Compression Ratio:", compressionRatio.toFixed(2));
      console.log("Bits per Sample:", bitsPerSample);
      console.log("Bits per Sample Original:", bitsPerSampleOriginal);

      await jimp.read('final_result_compress.jpg')
      .then(image => {
        // Get the image's format and color depth
        const format = image.getMIME();
        const bitsPerPixel = jimp.bpp[format];

        // Calculate the bits per sample
        const bitsPerSample = bitsPerPixel / image.getPixelCount();

        console.log('Bits per Sample jimp:', bitsPerSample);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else {
      console.log("Invalid ZIP archive. Expected one file.");
    }
  }

  returnerZipFinalImage(){

  }
}

module.exports = EntropyEncoder;
