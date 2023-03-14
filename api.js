const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const fs = require('fs');
const sharp = require('sharp');

// Ruta para enviar una respuesta al cliente de Angular
app.get('/api/data', (req, res) => {
  tx = "Hello from Node.js!";
  tx_json = JSON.stringify(tx);
  res.send(tx_json);
});

app.post('/api/uploadImage', upload.single('image'), (req,res)=> {
  console.log(req.file);
  const binaryData = fs.readFileSync(req.file.path);
  console.log(binaryData);
  sharp(binaryData)
  .toFormat('jpeg')
  .toBuffer()
  .then(jpgData => {
    // Write the JPG data to a file
    fs.writeFileSync('image.jpg', jpgData);
    const imagePath = './image.jpg';
    const image = fs.readFileSync(imagePath);
    const base64Image = Buffer.from(image).toString('base64');
    res.send({ image: base64Image });
  })
  .catch(err => {
    console.error(err);
  });
})

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});