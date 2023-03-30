const math = require("mathjs");

class Wavelet {
  constructor(x, y) {
    this.SubbandSizeX = x;
    this.SubbandSizeY = y;
  }

  RHaar_forward(vector) {
    const size = parseInt(vector.length);
    const vector_t = Array(size).fill(0);
    let counter = 0;
    for (let v_id = 0; v_id < size; v_id += 2) {
      vector_t[Math.floor(size / 2) + counter] =
        vector[v_id + 1] - vector[v_id];

      vector_t[counter] =
        vector[v_id] + Math.floor(vector_t[Math.floor(size / 2) + counter] / 2);
      counter += 1;
    }
    return vector_t;
  }

  RHaar_inverse(vector_t) {
    const size = parseInt(this.SubbandSizeX);
    const vector_rec = Array(size).fill(0);
    const s_ = parseInt(size / 2);
    let counter = 0;
    for (let v_id = 0; v_id < size; v_id += 2) {
      vector_rec[v_id] =
        vector_t[counter] - Math.floor(vector_t[s_ + counter] / 2);
      vector_rec[v_id + 1] = vector_t[s_ + counter] + vector_rec[v_id];
      counter += 1;
    }
    return vector_rec;
  }

  RHaar_transform(matrix) {
    for (let i = 0; i < this.SubbandSizeY; i++) {
      const aux = this.RHaar_forward(matrix[i]);
      matrix[i] = aux;
    }

    // for (let j = 0; j < this.SubbandSizeX; j++) {
    //   const aux_j = this.RHaar_forward(math.column(matrix, j));
    //   for (let b = 0; b < aux_j.length; b++) {
    //     matrix[b][j] = aux_j[b];
    //   }
    // }

    return matrix;
  }

  RHaar_destransform(matrix) {
    for (let j = 0; j < this.SubbandSizeX; j++) {
      const aux_j = this.RHaar_inverse(math.column(matrix, j));
      for (let b = 0; b < aux_j.length; b++) {
        matrix[b][j] = aux_j[b];
      }
    }

    for (let i = 0; i < this.SubbandSizeY; i++) {
      const aux = this.RHaar_inverse(matrix[i]);
      for (let a = 0; a < aux.length; a++) {
        matrix[i][a] = aux[a];
      }
    }

    return matrix;
  }

  RHaar_transByLevel(level, matrix) {
    if (level > 7) {
      level = 7;
    }
    let m_ = this.RHaar_transform(matrix);
    if (level !== 0) {
      for (let l = 0; l < level; l++) {
        this.SubbandSizeX = parseInt(this.SubbandSizeX / 2);
        this.SubbandSizeY = parseInt(this.SubbandSizeY / 2);
        m_ = this.RHaar_transform(m_);
      }
    }
    return m_;
  }

  RHaar_destransByLevel(level, matrix) {
    if (level > 7) {
      level = 7;
    }
    this.SubbandSizeX = parseInt(matrix[0].length / 2 ** level);
    this.SubbandSizeY = parseInt(matrix[0].length / 2 ** level);
    let m_ = RHaar_destransform(matrix);
    if (level != 0) {
      for (let l = 0; l < level; l++) {
        this.SubbandSizeX = parseInt(this.SubbandSizeX * 2);
        this.SubbandSizeY = parseInt(this.SubbandSizeY * 2);
        m_ = RHaar_destransform(m_);
      }
    }
    return m_;
  }

  trans_abs(matrix, abs_matrix) {
    for (let x = 0; x < this.SubbandSizeX; x++) {
      for (let y = 0; y < this.SubbandSizeY; y++) {
        abs_matrix[y][x] = parseInt(Math.abs(matrix[y][x]));
      }
    }
    return abs_matrix;
  }
}

module.exports = Wavelet;
