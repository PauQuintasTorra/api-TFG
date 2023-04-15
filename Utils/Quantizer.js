const math = require("mathjs");

class Quantizer{
    constructor(matrix, q_step){
        this.matrix = matrix;
        this.q_step = q_step;
    }

   
    quantize(){
       
    }

    getEntropyOrderZero(){
        let valors = {};
        let entropy = 0;
        for(let y = 0; y < this.matrix.length; y++){
            for (let x = 0; x < this.matrix[0].length; x++){
                if (this.matrix[y][x] in valors){
                    valors[this.matrix[y][x]] += 1;
                } else {
                    valors[this.matrix[y][x]] = 1;
                }
            }
        }
        for (const p in valors) {
            const prob = valors[p] / this.counter;
            entropy += prob * Math.log2(1 / prob);
        }
        return entropy;
    }

}

module.exports = Quantizer;

// class Quantizer:
    
    
//     def __init__(self,q_technique, q_step):
//         self.quantizer_technique = q_technique
//         self.quantization_step = q_step
        
//     def quantize(self, original_image, image_data_quantized):
        
//         for z in range(original_image.shape[0]):
//             for y in range(original_image.shape[1]):
//                 for x in range(original_image.shape[2]):
//                     abs_number = abs(original_image[z][y][x])
//                     number = math.floor(abs_number/self.quantization_step)
//                     if original_image[z][y][x] != 0:
//                         image_data_quantized[z][y][x] = number * int(math.floor(abs_number/original_image[z][y][x]))
//                     else:
//                         image_data_quantized[z][y][x] = 0
//     def dequantize(self, image_data_quantized, image_data_reconstructed):
//         q_step = self.quantization_step
//         for z in range(image_data_quantized.shape[0]):
//             for y in range(image_data_quantized.shape[1]):
//                 for x in range(image_data_quantized.shape[2]):
//                     image_data_reconstructed[z][y][x] = int((q_step * image_data_quantized[z][y][x]))
                    

//     def quantize_value(self, value):
//         if value == 0:
//             return 0
//         else:
//             abs_number = abs(value)
//             number = math.floor(abs_number/self.quantization_step)
//             return number * (abs_number/value)

//     def dequantize_value(self, value):
//         return self.quantization_step * value
    
                       



