class LetsCreate{

    constructor(image, boxes){
        this.image = image;
        this.boxes = boxes;
    }


    mainCreate(){

        for (let i = 0; i < this.boxes.length; i++){
            const className = this.boxes[i].nameClass;
            
            switch (className) {
              case 'wavelet':
                console.log("hola");
                break;
              case 'quantizer':
                console.log("bona tarda");
                break;
              case 'arithmeticOperation':
                console.log("bon dia");
            
              default:
                break;
            }
            
        }
    
        console.log(this.image)
    
    }


}

module.exports = LetsCreate;