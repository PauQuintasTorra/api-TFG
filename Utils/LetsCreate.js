const ArithmeticOperation = require("./ArithmeticOperation");
const EntropyEncoder = require("./EntropyEncoder");
const Metrics = require("./Metrics");
const Quantizer = require("./Quantizer");
const Statistics = require("./Statistics");
const Wavelet = require("./Wavelet");

class LetsCreate{

  constructor(image, boxes, originalFormat, processLogger){
      this.originalFormat = originalFormat;
      this.boxes = boxes;
      this.image = image;
      this.imageOriginal = JSON.parse(JSON.stringify(this.image));
      this.processLogger = processLogger;
  }


  mainCreate(){
    const statistics = new Statistics();
    this.processLogger.progress = [];
    this.processLogger.initStats = {
      max: statistics.getMax(this.image),
      min: statistics.getMin(this.image),
      entropy: statistics.getEntropyOrderZeroRGB(this.image),
      varianze: statistics.getVarianzeRGB(this.image),
      mean: statistics.getMeanRGB(this.image)
    }

    for (let i = 0; i < this.boxes.length; i++){
      const className = this.boxes[i].class.type;
        
      switch (className) {
        case 'Wavelet':
          const subBandX = this.image.red[0].length;
          const subBandY = this.image.red.length;
          const levels = this.boxes[i].class.waveletLevel;
          const wavelet = new Wavelet(subBandX,subBandY, levels);
          this.image = wavelet.mainTransform(this.image, this.originalFormat);
          break;

        case 'Quantizer':
          const q_step = this.boxes[i].class.q_step;
          const quantizer = new Quantizer(q_step);
          this.image =  quantizer.mainQuantize(this.image, this.originalFormat)
          break;

        case 'ArithmeticOperation':
          const value = this.boxes[i].class.operationNumber;
          const operationType = this.boxes[i].class.operationType;
          const arithmeticOperation = new ArithmeticOperation(value);
          switch (operationType) {
            case 'Add':
              this.image = arithmeticOperation.mainAddValue(this.image, this.originalFormat);
              break;
            case 'Sub':
              this.image = arithmeticOperation.mainSubstractValue(this.image, this.originalFormat);
              break;
            case 'Mult':
              this.image = arithmeticOperation.mainMultiplyValue(this.image, this.originalFormat);
              break;
            case 'Div':
              this.image = arithmeticOperation.mainDivideValue(this.image, this.originalFormat);
              break;
          }
          break;

        case 'EntropyEncoder':
          const entropyEncoder = new EntropyEncoder();
          entropyEncoder.codificacioZipCompress()

          break;
        
        
      }
      this.processLogger.progress[i] = {
        class: this.boxes[i].class,
        max: statistics.getMax(this.image),
        min: statistics.getMin(this.image),
        entropy: statistics.getEntropyOrderZeroRGB(this.image),
        varianze: statistics.getVarianzeRGB(this.image),
        mean: statistics.getMeanRGB(this.image)
      }
    }

    const imageSend = JSON.parse(JSON.stringify(this.image));
    return imageSend;
  }

  mainDecreate(){
    const metrics = new Metrics();
    for (let i = this.boxes.length - 1 ; i >= 0; i--){
      const className = this.boxes[i].class.type;
        
      switch (className) {
        case 'Wavelet':
          const subBandX = this.image.red[0].length;
          const subBandY = this.image.red.length;
          const levels = this.boxes[i].class.waveletLevel;
          const wavelet = new Wavelet(subBandX,subBandY, levels);
          this.image = wavelet.mainDestransform(this.image, this.originalFormat);
          break;

        case 'Quantizer':
          const q_step = this.boxes[i].class.q_step;
          const quantizer = new Quantizer(q_step);
          this.image =  quantizer.mainDequantize(this.image, this.originalFormat)
          break;

        case 'ArithmeticOperation':
          const value = this.boxes[i].class.operationNumber;
          const operationType = this.boxes[i].class.operationType;
          const arithmeticOperation = new ArithmeticOperation(value);
          switch (operationType) {
            case 'Add':
              this.image = arithmeticOperation.mainSubstractValue(this.image, this.originalFormat);
              break;
            case 'Sub':
              this.image = arithmeticOperation.mainAddValue(this.image, this.originalFormat);
              break;
            case 'Mult':
              this.image = arithmeticOperation.mainDivideValue(this.image, this.originalFormat);
              break;
            case 'Div':
              this.image = arithmeticOperation.mainMultiplyValue(this.image, this.originalFormat);
              break;
          }
      }
        
    }
    // console.log("PSNR: ", metrics.getPSNR_RGB(this.image, this.imageOriginal));
    // console.log("PAE: ", metrics.getPAE_RGB(this.image, this.imageOriginal));
    // console.log("MSE: ", metrics.getMSE_RGB(this.image, this.imageOriginal));
    this.processLogger.finalStats = {
      psnr: metrics.getPSNR_RGB(this.image, this.imageOriginal),
      pae: metrics.getPAE_RGB(this.image, this.imageOriginal),
      mse: metrics.getMSE_RGB(this.image, this.imageOriginal)
    }
    return {image: this.image, process: this.processLogger};
  }

  abs_all(matrix){
    for(let y = 0; y < matrix.length; y++){
      for(let x = 0; x < matrix[0].length; x++){
        matrix[y][x] = parseInt(Math.abs(matrix[y][x]));
        if(matrix[y][x] > 255) {
          matrix[y][x] = 255;
        } else {
          if (matrix[y][x] < -255) {
            matrix[y][x] = -255
          }
        }
      }
    }
  }

}

module.exports = LetsCreate;