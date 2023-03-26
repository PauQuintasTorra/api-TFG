const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const ImageLoader = require("./Utils/ImageLoader");
const ManageFolders = require("./Utils/ManageFolders");
const ManageImage = require("./Utils/ManageImage");
const Wavelet = require("./Utils/Wavelet");
const zeros = require("./Utils/zeros");
const { spawn } = require("child_process");
const dw = require("discrete-wavelets");
const Jimp = require("jimp");
const PNG = require("pngjs").PNG;
const sharp = require("sharp");

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
    console.log("AR");
    const im = new ManageImage(req.files["image"][0].path);
    const inputArrayRed = await im.trying(req.files["image"][0].path);
    console.log(inputArrayRed);
    // const pro = im.splitArray(ar);
    // console.log(pro);
    const formatSelected = req.body["formatSelected"];
    const imatge = new ImageLoader(req.files["image"][0].path);
    const formatImage = imatge.extractFormat(
      req.files["image"][0].originalname
    );
    const enviar = await imatge.exportRAW(formatImage, formatSelected);

    console.log(im.getWidth(), im.getHeight());

    const wavelet = new Wavelet(inputArrayRed.length, inputArrayRed[0].length);

    const provaRed = wavelet.RHaar_transform(inputArrayRed);

    const empty_matrix = new Array(provaRed.length).fill(0);
    for (let i = 0; i < provaRed.length; i++) {
      empty_matrix[i] = new Array(provaRed[0].length).fill(0);
    }
    // const provaGreen = wavelet.RHaar_transform(inputArrayGreen);
    // const provaBlue = wavelet.RHaar_transform(inputArrayBlue);

    const trans_absRed = wavelet.trans_abs(provaRed, empty_matrix);

    // const trans_absGreen = wavelet.trans_abs(provaGreen, empty_matrix);
    // const trans_absBlue = wavelet.trans_abs(provaBlue, empty_matrix);

    // var count = 0;
    // for (let i = 0; i < prova.length; i++) {
    //   for (let j = 0; j < prova[i].length; j++) {
    //     if (prova[i][j] > 256 || prova[i][j] < -256) {
    //       count += 1;
    //       console.log(prova[i][j]);
    //     }
    //   }
    // }

    // console.log("FINAL", count);

    // Create a new Jimp image with the same dimensions as the input array
    const image = new Jimp(trans_absRed.length, trans_absRed[0].length);

    // Iterate over the input arrays and set the color of each pixel in the image
    trans_absRed.forEach((row, y) => {
      row.forEach((red, x) => {
        //   const green = trans_absGreen[y][x];
        //   const blue = trans_absBlue[y][x];
        const pixelColor = Jimp.rgbaToInt(red, 0, 0, 255);
        image.setPixelColor(pixelColor, x, y);
      });
    });

    // Save the image as a JPEG file
    image.write("output.jpg");

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
