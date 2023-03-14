const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const fs = require('fs');
const dw = require('discrete-wavelets');
const trying = require('./Utils/ManageImage')
const ImageLoader = require('./Utils/ImageLoader');
const ManageFolders = require('./Utils/ManageFolders');

// Ruta para enviar una respuesta al cliente de Angular
app.get('/api/data', (req, res) => {
  tx = "Hello from Node.js!";
  tx_json = JSON.stringify(tx);
  res.send(tx_json);
});

app.post('/api/uploadImage', upload.single('image'), async (req,res) => {
  const empty = new ManageFolders('./uploads');
  const imatge = new ImageLoader();
  const enviar = await imatge.exportRAW(req.file.path);
  const imageArray = await trying('image.jpg');
  console.log("BBBBBBBB");
  const trans = dw.wavedec(imageArray, 'haar');
  res.send(trans);
  empty.deleteAll()
})

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});