const math = require('mathjs')

function trans_abs(matrix){
    for (let x = 0; x < matrix[0].length; x++) {
        for (let y = 0; y < matrix.length; y++) {
            matrix[y][x] = parseInt(Math.abs(matrix[y][x]));
        }
    }
    return matrix;
      
}

function normalizeMatrix(matrix){
    
    const max_matrix = math.max(math.flatten(matrix));
    if (max_matrix <= 255) {return matrix}
    else {
        let matrix_abs = trans_abs(matrix);
        const max_matrix_abs = math.max(math.flatten(matrix_abs));

        for (let x = 0; x < matrix_abs[0].length; x++) {
            for (let y = 0; y < matrix_abs.length; y++) {
                matrix_abs[y][x] = math.round((matrix_abs[y][x]/max_matrix_abs) * 255)
            }
        }
    
        return matrix_abs;
    }
    


}


module.exports = trans_abs;
module.exports = normalizeMatrix;