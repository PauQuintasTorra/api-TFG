class LetsCreate{

    constructor(image, boxes){
        this.image = image;
        this.boxes = boxes;
    }


    mainCreate(){

        for (let i = 0; i < this.boxes.length; i++){
            const className = this.boxes[i].class.type;
            
            switch (className) {
              case 'Wavelet':
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
    

        return this.image;
    }


}

module.exports = LetsCreate;