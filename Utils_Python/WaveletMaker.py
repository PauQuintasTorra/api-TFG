import sys
import os
import numpy as np
from Wavelet import *
import json

filename = sys.argv[1]
delimiter = ','

# Open the file for reading
with open(filename, 'r') as f:
  # Read each line of the file and convert it to a list
  array2d = [[int(x) for x in line.strip().split(delimiter)] for line in f]

# Print the contents of the array
print(json.dumps(array2d))

# path_input_array = json.loads(sys.argv[1])
# height = json.loads(sys.argv[2])
# width = json.loads(sys.argv[3])

# ##TEST WAVELET## --> IT WORKS
# X_ = width
# Y_ = height
# wavelet = Wavelet(X_, Y_)

# ##TEST TRANSFORMADA LEVEL 0 COMPLETED## --> IT WORKS
# empty_matrix = np.zeros(input_array.shape)
# trans_level_zero = wavelet.RHaar_transform(input_array)

# ##TEST TRANSFORMADA --> ABS_TRANSFORMADA## --> IT WORKS
# matrix_abs_definitiva = wavelet.trans_abs(trans_level_zero, empty_matrix)

# ##TEST REVERSE TRANSFORMADA## 
# original_image_trans = wavelet.RHaar_destransform(trans_level_zero)

# print(json.dumps(matrix_abs_definitiva))