const Wavelet = require("./Wavelet");

class LetsCreate{

  constructor(boxes, originalFormat){
      this.originalFormat = originalFormat;
      this.boxes = boxes;
      this.image = null;
  }


  mainCreate(inputArray){

      for (let i = 0; i < this.boxes.length; i++){
          const className = this.boxes[i].class.type;
          
          switch (className) {
            case 'Wavelet':
              const subBandX = inputArray.red[0].length;
              const subBandY = inputArray.red.length;
              const levels = this.boxes[i].class.waveletLevel;
              const wavelet = new Wavelet(subBandX,subBandY, levels);
              this.image = wavelet.mainTransform(inputArray, this.originalFormat);

              console.log("hola");
              break;
            case 'Quantizer':
              console.log("bona tarda");
              break;
            case 'ArithmeticOperation':
              console.log("bon dia");
          
            default:
              break;
          }
          
      }
  
      this.abs_all(this.image.red);
      this.abs_all(this.image.green);
      this.abs_all(this.image.blue);
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