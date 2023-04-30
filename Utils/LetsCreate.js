const ArithmeticOperation = require("./ArithmeticOperation");
const Metrics = require("./Metrics");
const Quantizer = require("./Quantizer");
const Wavelet = require("./Wavelet");

class LetsCreate{

  constructor(image, boxes, originalFormat){
      this.originalFormat = originalFormat;
      this.boxes = boxes;
      this.image = image;
      this.imageSend = image;
      this.imageOriginal = JSON.parse(JSON.stringify(this.image))
  }


  mainCreate(){
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

      }
    }

    this.imageSend = JSON.parse(JSON.stringify(this.image));
    this.abs_all(this.imageSend.red);
    this.abs_all(this.imageSend.green);
    this.abs_all(this.imageSend.blue);
    return this.imageSend;
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
    console.log("PSNR: ", metrics.getPSNR_RGB(this.image, this.imageOriginal));
    console.log("PAE: ", metrics.getPAE_RGB(this.image, this.imageOriginal));
    console.log("MSE: ", metrics.getMSE_RGB(this.image, this.imageOriginal));
    return this.image;
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