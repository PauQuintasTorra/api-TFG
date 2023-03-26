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
    const ar = await im.trying(req.files["image"][0].path);
    console.log(ar);
    const pro = im.splitArray(ar);
    //console.log(pro);
    const formatSelected = req.body["formatSelected"];
    const imatge = new ImageLoader(req.files["image"][0].path);
    const formatImage = imatge.extractFormat(
      req.files["image"][0].originalname
    );
    const enviar = await imatge.exportRAW(formatImage, formatSelected);

    console.log(im.getWidth(), im.getHeight());
    const command = "python";
    const scriptPath = "./Utils_Python/WaveletMaker.py";
    const inputArray = pro.red;
    // console.log(inputArray);
    const he = im.getHeight();
    const wi = im.getWidth();
    const wavelet = new Wavelet(pro.red.length, pro.red[0].length);

    const empty_matrix = new Array(im.getHeight()).fill(0);
    for (let i = 0; i < im.getHeight(); i++) {
      empty_matrix[i] = new Array(im.getWidth()).fill(0);
    }

    console.log("abans");
    console.log(inputArray != undefined);
    const prova = wavelet.RHaar_transform(inputArray);
    console.log("després");
    console.log("PROVA MATRIX");
    console.log(prova);
    console.log("Final");

    // const trans_level_zero = wavelet.RHaar_transform(inputArray);
    // console.log("aaaarray")
    // console.log(inputArray)
    const trans_abs = wavelet.trans_abs(prova, empty_matrix);
    // console.log("OOOOOTRO")
    var count = 0;
    for (let i = 0; i < prova.length; i++) {
      for (let j = 0; j < prova[i].length; j++) {
        if (prova[i][j] > 256 || prova[i][j] < -256) {
          count += 1;
          console.log(prova[i][j]);
        }
      }
    }

    console.log("FINAL", count);

    // Create a new Jimp image with the same dimensions as the input array
    const image = new Jimp(trans_abs[0].length, trans_abs.length);

    // Iterate over the input array and set the red channel of each pixel in the image
    trans_abs.forEach((row, y) => {
      row.forEach((value, x) => {
        const pixelColor = Jimp.rgbaToInt(value, 0, 0, 255); // create a Jimp color from the red channel value
        image.setPixelColor(pixelColor, x, y); // set the color of the pixel in the image
      });
    });

    // Save the image as a grayscale JPEG file
    image.grayscale().write("output.jpg");

    // for (let i = 0; i < pro.red.length; i++) {
    //   var coeffs = dw.dwt(pro.red[i], "haar");
    //   const r = coeffs.reduce((acc, cur) => acc.concat(cur), []);
    //   empty_matrix[i] = r;
    // }

    // console.log(empty_matrix);

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
