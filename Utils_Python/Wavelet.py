import sys
import json

input_array = json.loads(sys.stdin.read())

# Process the input array
output_array = [x * 2 for x in input_array]

# Serialize the output array as a JSON string and print it to standard output
output_json = json.dumps(output_array)
print(output_json)


# class Wavelet:
    
    
#     def __init__(self,x, y):
#         self.SubbandSizeX = x
#         self.SubbandSizeY = y
        
        
#     def RHaar_forward(self, vector):
#         size = int(self.SubbandSizeX)
#         vector_t = [0] * int(self.SubbandSizeX)
#         counter = 0
#         for v_id in range(0,size,2):
#             vector_t[int((size/2) + counter)] = vector[v_id + 1] - vector[v_id] 
#             vector_t[counter] = vector[v_id] + math.floor(vector_t[int((size/2) + counter)]/2)
#             counter += 1
            
#         return vector_t            
        
        
#     def RHaar_inverse(self, vector_t):
#         size = int(self.SubbandSizeX)
#         vector_rec = [0] * int(self.SubbandSizeX)
#         s_ = int(size/2)
#         counter = 0
#         for v_id in range(0,size,2):
#             vector_rec[v_id] = vector_t[counter] - math.floor(vector_t[s_ + counter]/2)
#             vector_rec[v_id + 1] = vector_t[s_ + counter] + vector_rec[v_id]
#             counter += 1
            
#         return vector_rec
    
    
#     def RHaar_transform(self, matrix):
#         for i in range(self.SubbandSizeX):
#             aux = self.RHaar_forward(matrix[0][i])
#             for a in range(len(aux)):
#                 matrix[0][i][a] = aux[a]

#         for j in range(self.SubbandSizeX):
#             aux_j = self.RHaar_forward(matrix[0][:,j])
#             for b in range(len(aux_j)):
#                 matrix[0][b][j] = aux_j[b]
                
#         return matrix
    
    
#     def RHaar_destransform(self, matrix):  
#         for j in range(self.SubbandSizeX):
#             aux_j = self.RHaar_inverse(matrix[0][:,j])
#             for b in range(len(aux_j)):
#                 matrix[0][b][j] = aux_j[b]
                
#         for i in range(self.SubbandSizeY):
#             aux = self.RHaar_inverse(matrix[0][i])
#             for a in range(len(aux)):
#                 matrix[0][i][a] = aux[a]
                
#         return matrix
    
    
#     def RHaar_transByLevel(self, level, matrix):
#         if level > 7:
#             level = 7
#         m_ = self.RHaar_transform(matrix)
#         if level != 0:
#             for l in range(level):
#                 self.SubbandSizeX = int(self.SubbandSizeX / 2)
#                 self.SubbandSizeY = int(self.SubbandSizeY / 2)
#                 m_ = self.RHaar_transform(m_)
        
#         return m_
    
    
#     def RHaar_destransByLevel(self, level, matrix):
#         if level > 7:
#             level = 7
#         self.SubbandSizeX = int(len(matrix[0]) / 2**(level))
#         self.SubbandSizeY = int(len(matrix[0]) / 2**(level))
#         m_ = self.RHaar_destransform(matrix)
#         if level != 0:
#             for l in range(level):
#                 self.SubbandSizeX = int(self.SubbandSizeX * 2)
#                 self.SubbandSizeY = int(self.SubbandSizeY * 2)
#                 m_ = self.RHaar_destransform(m_)
        
#         return m_
    
    
#     def trans_abs(self, matrix, abs_matrix):
#         for z in range(matrix.shape[0]):
#             for y in range(matrix.shape[1]):
#                 for x in range(matrix.shape[2]):
#                     abs_matrix[z][y][x] = int(abs(matrix[z][y][x]))
        
#         return abs_matrix  

                       
    