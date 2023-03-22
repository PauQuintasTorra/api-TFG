const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const fs = require('fs');
const ImageLoader = require('./Utils/ImageLoader');
const ManageFolders = require('./Utils/ManageFolders');
const ManageImage = require('./Utils/ManageImage');
const {spawn} = require('child_process');
const dw = require('discrete-wavelets');


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

  var coeffs = dw.dwt(inputArray[0], 'haar');
  console.log(coeffs)
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