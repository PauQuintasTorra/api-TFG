module.exports = function zeros(shape) {
    if (shape === 0) {
      return 0;
    } else {
      const arr = Array.from({length: shape[0]}, () => zeros(shape.slice(1)));
      return arr.fill(0);
    }
}

module.exports = function invertColumnsAndRows(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
  
    for (let j = 0; j < cols; j++) {
      result[j] = [];
      for (let i = 0; i < rows; i++) {
        result[j][i] = matrix[i][j];
      }
    }
  
    return result;
  }