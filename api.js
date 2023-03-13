const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

// Ruta para enviar una respuesta al cliente de Angular
app.get('/api/data', (req, res) => {
  tx = "Hello from Node.js!";
  tx_json = JSON.stringify(tx);
  res.send(tx_json);
});

app.post('/api/uploadImage', upload.single('image'), (req,res)=> {
  console.log(req.body);
  console.log(req.file);
  res.send(JSON.stringify("Arriba al back!"));
})

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});