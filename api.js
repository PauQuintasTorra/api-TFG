const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const fs = require('fs');
const ImageLoader = require('./Utils/ImageLoader');
const ManageFolders = require('./Utils/ManageFolders');
const ManageImage = require('./Utils/ManageImage');
const Wavelet = require('./Utils/Wavelet');
const zeros = require('./Utils/zeros')
const {spawn} = require('child_process');
const dw = require('discrete-wavelets');
const Jimp = require('jimp');
const PNG = require('pngjs').PNG;


// Ruta para enviar una respuesta al cliente de Angular
app.get('/api/data', (req, res) => {
  tx = "Hello from Node.js!";
  tx_json = JSON.stringify(tx);
  res.send(tx_json);
});

app.post('/api/uploadImage', upload.fields([{name: 'image'},{name: 'formatSelected'}]), async (req,res) => {
  const empty = new ManageFolders('./uploads');
  console.log("AR")
  const im = new ManageImage(req.files['image'][0].path);
  const ar = await im.trying(req.files['image'][0].path);
  const pro = im.splitArray(ar);
  //console.log(pro);
  const formatSelected = req.body['formatSelected'];
  const imatge = new ImageLoader(req.files['image'][0].path);
  const formatImage = imatge.extractFormat(req.files['image'][0].originalname);
  const enviar = await imatge.exportRAW(formatImage, formatSelected);

  console.log(im.getWidth(), im.getHeight())
  const command = 'python';
  const scriptPath = './Utils_Python/WaveletMaker.py';
  const inputArray = pro.red;
  console.log(inputArray)

  const wavelet = new Wavelet(im.getWidth(),im.getHeight());
  
  const empty_matrix = new Array(im.getHeight()).fill(0);
  for (let i = 0; i < im.getHeight(); i++) {
    empty_matrix[i] = new Array(im.getWidth()).fill(0);
  }

  // const trans_level_zero = wavelet.RHaar_transform(inputArray);
  // console.log("aaaarray")
  // console.log(inputArray)
  // const trans_abs = wavelet.trans_abs(trans_level_zero, empty_matrix);
  // console.log("OOOOOTRO")
  var count = 0;
  for (let i = 0; i < pro.red.length; i++) {
    for(let j = 0; j < pro.red[i].length; j++){
      if(pro.red[i][j] > 256){
        count +=1;
        console.log(pro.red[i][j]);
      }
    }
  } 

  console.log("FINAL", count);

  for(let i = 0; i < pro.red.length; i++){
    var coeffs = dw.dwt(pro.red[i], 'haar');
    const r = coeffs.reduce((acc, cur) => acc.concat(cur), []);
    empty_matrix[i] = r;
  }
  

  const maxVal = Math.max(...empty_matrix.flat());
  const minVal = Math.min(...empty_matrix.flat());
  const normalizedMatrix = empty_matrix.map(row => row.map(val => Math.round((val - minVal) / (maxVal - minVal) * 65535)));

  const png = new PNG({
    width: normalizedMatrix[0].length,
    height: normalizedMatrix.length,
    bitDepth: 16,
    colorType: 0, // grayscale
  });

  // Convert the 2D array to a flat buffer of 16-bit values
  const data = Buffer.alloc(png.width * png.height * 2);
  for (let i = 0; i < png.height; i++) {
    for (let j = 0; j < png.width; j++) {
      const val = normalizedMatrix[i][j];
      data.writeUInt16BE(val, (i * png.width + j) * 2);
    }
  }

  png.data = data;

  png.pack().pipe(fs.createWriteStream('wavelet.png'));

  //console.log(empty_matrix);
  

  // const filename = 'array.txt';
  // const delimiter = ',';
  
  // // Create a write stream to the file
  // const writeStream = fs.createWriteStream(filename);
  // console.log(inputArray.length)
  // // // Write each row of the array to the file
  // for (let i = 0; i < inputArray.length; i++) {
  //   writeStream.write(inputArray[i].join(delimiter) + '\n');
  // }
  
  // writeStream.end();



  // const child = spawn(command, [scriptPath,filename,im.getHeight(),im.getWidth()]);
  // child.stdin.end();


  // child.stdout.on('data', (data) => {
  //   const outputJson = data.toString();
  //   const outputArray = JSON.parse(outputJson);
  //   console.log(outputArray);
    
  // });

  // child.stderr.on('data', (data) => {
  //   console.error(data.toString());
  // });

  res.send(enviar);
  empty.deleteAll()

})


app.post('/api/downloadImageURL', async (req, res) => {
  console.log(req);
  const format = req.query.format;
  console.log(format);
  const filePath = `example.${format}`;
  const image = await fs.readFileSync(filePath);
  const contentType = `image/${format}`;
  res.writeHead(200, {'Content-Type': contentType});
  res.end(image, 'binary');

});

// app.get('/api/downloadImageURL', (req, res) => {
//   const filePath = 'example.png'; // Replace with the path to your image file
//   fs.readFile(filePath, (err, data) => {
//     if (err) throw err;
//     res.send(data);
//   });
// });

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});