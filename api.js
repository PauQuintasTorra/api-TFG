const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const ImageLoader = require("./Utils/ImageLoader");
const ManageFolders = require("./Utils/ManageFolders");
const ManageImage = require("./Utils/ManageImage");
const Wavelet = require("./Utils/Wavelet");

// Ruta para enviar una respuesta al cliente de Angular
app.get("/api/data", (req, res) => {
  tx = "Hello from Node.js!";
  tx_json = JSON.stringify(tx);
  res.send(tx_json);
});

app.post(
  "/api/uploadImage",
  upload.fields([{ name: "image" }, { name: "formatSelected" }]),
  async (req, res) => {
    const empty = new ManageFolders("./uploads");
    const im = new ManageImage(req.files["image"][0].path);
    const inputArray = await im.trying();
    const height = im.getHeight();
    const width = im.getWidth();
    const wavelet = new Wavelet(width, height);

    const formatSelected = req.body["formatSelected"];

    console.log(req.files["image"][0].path)
    const imatge = new ImageLoader(req.files["image"][0].path);
    const formatImage = imatge.extractFormat(
      req.files["image"][0].originalname
    );

    const enviar = await imatge.exportRAW(formatImage, formatSelected);

    wavelet.main(inputArray, formatSelected, 2);

    res.send(enviar);
    empty.deleteAll();
  }
);

app.post(
  "/api/seeImage",
  upload.fields([{ name: "image" }, { name: "operation" }]),
  async (req, res) => {
    const empty = new ManageFolders("./uploads");
    const im = new ManageImage(req.files["image"][0].path);
    const inputArray = await im.trying();
    const height = im.getHeight();
    const width = im.getWidth();
    const wavelet = new Wavelet(width, height);

    const formatSelected = req.body["formatSelected"];

    console.log(req.files["image"][0].path)
    const imatge = new ImageLoader(req.files["image"][0].path);
    const formatImage = imatge.extractFormat(
      req.files["image"][0].originalname
    );
    
    const enviar = await imatge.exportRAW(formatImage, formatSelected);

    wavelet.main(inputArray, formatSelected, 2);

    res.send(enviar);
    empty.deleteAll();
  }
);

app.post("/api/downloadImageURL", async (req, res) => {
  console.log(req);
  const format = req.query.format;
  console.log(format);
  const filePath = `example.${format}`;
  const image = await fs.readFileSync(filePath);
  const contentType = `image/${format}`;
  res.writeHead(200, { "Content-Type": contentType });
  res.end(image, "binary");
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
  console.log("Servidor iniciado en http://localhost:3000");
});
