const AdmZip = require("adm-zip");

const fs = require("fs");
const { reject } = require("lodash");
const { resolve } = require("path");

class EntropyEncoder {
  constructor() {}

  codificacioZlib(name) {
    return new Promise((resolve, reject) => {
      const imagePath = name;
      const zipPath = "prova.zip";

      // Read the image data
      const imageData = fs.readFileSync(imagePath);

      // Create a new instance of AdmZip
      const zip = new AdmZip();

      // Add the compressed image data to the ZIP archive
      zip.addFile(name, Buffer.from(imageData), "image data");

      // Save the ZIP archive to disk
      zip.writeZip(zipPath, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("Image compressed and zipped successfully!");
          resolve();
        }
      });
    });
  }

  descodificacio() {
    const zipPath = "prova.zip";

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
      const uncompressedSize = imageEntry.header.uncompressedSize;
      console.log(compressedSize, uncompressedSize);
      const compressionRatio = (1 - compressedSize / uncompressedSize) * 100;

      // Calculate the bits per sample
      const bitsPerSample = imageData.length * 8;

      console.log("Compression Ratio:", compressionRatio.toFixed(2) + "%");
      console.log("Bits per Sample:", bitsPerSample);
    } else {
      console.log("Invalid ZIP archive. Expected one file.");
    }
  }
}

module.exports = EntropyEncoder;
