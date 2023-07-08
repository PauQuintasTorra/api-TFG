const ArithmeticOperation = require("./ArithmeticOperation");
const ZIPEncoder = require("./ZIPEncoder");
const LZEncoder = require("./LZEncoder");
const Metrics = require("./Metrics");
const Quantizer = require("./Quantizer");
const Statistics = require("./Statistics");
const Wavelet = require("./Wavelet");
const ManageFolders = require("./ManageFolders");
const ManageImage = require("./ManageImage");

class LetsCreate {
  constructor(image, boxes, originalFormat, processLogger, xtocut, ytocut) {
    this.originalFormat = originalFormat;
    this.boxes = boxes;
    this.image = image;
    this.imageOriginal = JSON.parse(JSON.stringify(this.image));
    this.processLogger = processLogger;
    this.noProcess = false;
    this.hasEncoder = false;
    this.xToCut = xtocut;
    this.yToCut = ytocut;
    this.initialEntropy = 0;
    this.lastEntropy = 0;
  }

  mainCreate() {
    const statistics = new Statistics();
    this.processLogger.progress = [];
    this.processLogger.entropyStats = {};
    this.processLogger.initStats = {
      max: statistics.getMax(this.image),
      min: statistics.getMin(this.image),
      entropy: Number(statistics.getEntropyOrderZeroRGB(this.image).toFixed(2)),
      varianze: Number(statistics.getVarianzeRGB(this.image).toFixed(2)),
      mean: Number(statistics.getMeanRGB(this.image).toFixed(2)),
    };
    this.initialEntropy = statistics.getEntropyOrderZeroRGB(this.image);

    for (let i = 0; i < 4; i++) {
      let className = "Defalt";
      if (i < this.boxes.length) {
        className = this.boxes[i].class.type;
      }
      switch (className) {
        case "Wavelet":
          let subBandX = this.image.red[0].length;
          let subBandY = this.image.red.length;

          const levels = this.boxes[i].class.waveletLevel;
          const wavelet = new Wavelet(subBandX, subBandY, levels);
          this.image = wavelet.mainTransform(this.image, this.originalFormat);
          break;

        case "Quantizer":
          const q_step = this.boxes[i].class.q_step;
          const quantizer = new Quantizer(q_step);
          this.image = quantizer.mainQuantize(this.image, this.originalFormat);
          break;

        case "ArithmeticOperation":
          const value = this.boxes[i].class.operationNumber;
          const operationType = this.boxes[i].class.operationType;
          const arithmeticOperation = new ArithmeticOperation(value);
          switch (operationType) {
            case "Add":
              this.image = arithmeticOperation.mainAddValue(
                this.image,
                this.originalFormat
              );
              break;
            case "Sub":
              this.image = arithmeticOperation.mainSubstractValue(
                this.image,
                this.originalFormat
              );
              break;
            case "Mult":
              this.image = arithmeticOperation.mainMultiplyValue(
                this.image,
                this.originalFormat
              );
              break;
            case "Div":
              this.image = arithmeticOperation.mainDivideValue(
                this.image,
                this.originalFormat
              );
              break;
          }
          break;

        case "EntropyEncoder":
          this.hasEncoder = true;
          const encoderType = this.boxes[i].class.encoderType;
          switch (encoderType) {
            case "Lzma":
              const lzEncoder = new LZEncoder();
              lzEncoder
                .mainprova(
                  this.imageOriginal,
                  this.image,
                  this.xToCut,
                  this.yToCut,
                  this.initialEntropy,
                  this.lastEntropy
                )
                .then((lzEncoderStats) => {
                  this.processLogger.entropyStats.compressionRatio = Number(lzEncoderStats.toFixed(2)); 

                });

              break;
            case "Zip":
              const zipEncoder = new ZIPEncoder();
              zipEncoder
                .mainprova(
                  this.imageOriginal,
                  this.image,
                  this.xToCut,
                  this.yToCut,
                  this.initialEntropy,
                  this.lastEntropy
                )
                .then((zipEncoderStats) => {
                    this.processLogger.entropyStats.compressionRatio = Number(zipEncoderStats.toFixed(2)); 
                  });

              break;
          }
          break;

        default:
          this.noProcess = true;
          this.processLogger.progress[i] = {
            type: "Sense dades",
            class: "Sense dades",
            value: "Sense dades",
            max: "Sense dades",
            min: "Sense dades",
            entropy: "Sense dades",
            varianze: "Sense dades",
            mean: "Sense dades",
          };
          break;
      }
      if (!this.noProcess) {
        this.processLogger.progress[i] = {
          class: this.boxes[i].class,
          max: statistics.getMax(this.image),
          min: statistics.getMin(this.image),
          entropy: Number(statistics.getEntropyOrderZeroRGB(this.image).toFixed(2)),
          varianze: Number(statistics.getVarianzeRGB(this.image).toFixed(2)),
          mean: Number(statistics.getMeanRGB(this.image).toFixed(2)),
        };
        this.noProcess = false;
      }
      this.lastEntropy = statistics.getEntropyOrderZeroRGB(this.image);
    }
    if (!this.hasEncoder) {
      this.processLogger.entropyStats = {
        compressionRatio: 0,
      };
    }
    this.processLogger.entropyStats.finalEntropy = Number(this.lastEntropy.toFixed(2));

    const imageSend = JSON.parse(JSON.stringify(this.image));
    return imageSend;
  }

  mainDecreate() {
    const metrics = new Metrics();
    for (let i = this.boxes.length - 1; i >= 0; i--) {
      const className = this.boxes[i].class.type;

      switch (className) {
        case "Wavelet":
          let subBandX = this.image.red[0].length;
          let subBandY = this.image.red.length;
          const levels = this.boxes[i].class.waveletLevel;
          const wavelet = new Wavelet(subBandX, subBandY, levels);
          this.image = wavelet.mainDestransform(
            this.image,
            this.originalFormat
          );
          break;

        case "Quantizer":
          const q_step = this.boxes[i].class.q_step;
          const quantizer = new Quantizer(q_step);
          this.image = quantizer.mainDequantize(
            this.image,
            this.originalFormat
          );
          break;

        case "ArithmeticOperation":
          const value = this.boxes[i].class.operationNumber;
          const operationType = this.boxes[i].class.operationType;
          const arithmeticOperation = new ArithmeticOperation(value);
          switch (operationType) {
            case "Add":
              this.image = arithmeticOperation.mainSubstractValue(
                this.image,
                this.originalFormat
              );
              break;
            case "Sub":
              this.image = arithmeticOperation.mainAddValue(
                this.image,
                this.originalFormat
              );
              break;
            case "Mult":
              this.image = arithmeticOperation.mainDivideValue(
                this.image,
                this.originalFormat
              );
              break;
            case "Div":
              this.image = arithmeticOperation.mainMultiplyValue(
                this.image,
                this.originalFormat
              );
              break;
          }
          break;

        case "EntropyEncoder":
          break;
      }
    }

    const im = new ManageImage();
    const redFinal = im.selectPositions(
      this.image.red,
      0,
      this.yToCut,
      0,
      this.xToCut
    );
    const greenFinal = im.selectPositions(
      this.image.green,
      0,
      this.yToCut,
      0,
      this.xToCut
    );
    const blueFinal = im.selectPositions(
      this.image.blue,
      0,
      this.yToCut,
      0,
      this.xToCut
    );
    const finalResult = { red: redFinal, green: greenFinal, blue: blueFinal };

    this.image = finalResult;

    this.processLogger.finalStats = {
      psnr: metrics.getPSNR_RGB(this.image, this.imageOriginal) === 0 ? "∞": Number(metrics.getPSNR_RGB(this.image, this.imageOriginal).toFixed(2)),
      pae: Number(metrics.getPAE_RGB(this.image, this.imageOriginal).toFixed(2)),
      mse: Number(metrics.getMSE_RGB(this.image, this.imageOriginal).toFixed(2)),
    };
    return { image: this.image, process: this.processLogger };
  }

  abs_all(matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        matrix[y][x] = parseInt(Math.abs(matrix[y][x]));
        if (matrix[y][x] > 255) {
          matrix[y][x] = 255;
        } else {
          if (matrix[y][x] < -255) {
            matrix[y][x] = -255;
          }
        }
      }
    }
  }
}

module.exports = LetsCreate;
