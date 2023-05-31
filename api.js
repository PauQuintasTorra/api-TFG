const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const ImageLoader = require("./Utils/ImageLoader");
const ManageFolders = require("./Utils/ManageFolders");
const ManageImage = require("./Utils/ManageImage");
const Wavelet = require("./Utils/Wavelet");
const Statistics = require("./Utils/Statistics");
const LetsCreate = require("./Utils/LetsCreate");
const Quantizer = require("./Utils/Quantizer");
const ArithmeticOperation = require("./Utils/ArithmeticOperation");
const LZEncoder = require("./Utils/LZEncoder");
const DownloaderFromJson = require("./Utils/DownloaderFromJson");

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
    const inputArray = await im.pathToArrayRGB();
    const aa = JSON.parse(JSON.stringify(inputArray));
    const provaAr = JSON.parse(JSON.stringify(inputArray));
    const height = await im.getHeight();
    const width = await im.getWidth();
    const size = req.files["image"][0].size;

    const formatSelected = req.body["formatSelected"];

    const imatge = new ImageLoader(req.files["image"][0].path);
    const formatImage = im.extractFormat(req.files["image"][0].originalname);
    // const enviar__ = await imatge.exportRAW(formatImage, formatSelected);

    const lzEncoder = new LZEncoder();
    lzEncoder.mainprova(inputArray, aa);

    // ARITHMETIC OPERATION
    // const sumar = new ArithmeticOperation(5);
    // const suma_feta = sumar.mainDivideValue(provaAr, formatImage);

    // WAVELET
    // const wavelet = new Wavelet(width, height, 2);
    // const rrr = wavelet.mainTransform(inputArray, formatImage);
    // const ddd = wavelet.mainDestransform(rrr, formatImage);

    // STATISTICS
    // const statistics_original = new Statistics();
    // // console.log("Mitja de la imatge", statistics_original.getVarianze(ddd));
    // console.log(
    //   "Mitja de la imatge",
    //   statistics_original.getEntropyOrderZeroRGB(aa)
    // );
    // console.log(statistics_original.getEntropyOrderZero(aa.red));
    // console.log(statistics_original.getEntropyOrderZero(aa.green));
    // console.log(statistics_original.getEntropyOrderZero(aa.blue));
    // const entropyRed_original = new Statistics(aa.red);
    // console.log("Entropia red", entropyRed_original.getEntropyOrderZero());
    // console.log("Entropia wave", entropyRed_wavelet.getEntropyOrderZero());

    // QUANTITZADOR
    // const quantizer = new Quantizer(6);
    // const a = quantizer.mainQuantize(aa, formatImage);
    // //const enviar = await imatge.exportInputArray(a,formatImage, formatSelected)
    // const b = quantizer.mainDequantize(a, formatImage);
    // console.log(
    //   "Mitja de la imatge",
    //   statistics_original.getEntropyOrderZeroRGB(b)
    // );

    // const name_path = await imatge.exportInputArray(b, formatImage);
    const enviar = await imatge.getReadyToSend('imatge_original', formatImage);
    res.send(enviar);
    empty.deleteAll();
  }
);

app.post(
  "/api/seeImage",
  upload.fields([
    { name: "image" },
    { name: "originalFormat" },
    { name: "boxes" },
  ]),
  async (req, res) => {
    const processLogger = {};
    processLogger.nameImage = req.files["image"][0].originalname;
    processLogger.timestamp =
      Date.now() + "-" + Math.round(Math.random() * 1000000);
    const empty = new ManageFolders("./uploads");
    const imatge = new ImageLoader();
    const boxes = JSON.parse(req.body.boxes);
    const originalFormat = req.body.originalFormat;
    console.log(boxes);
    const im = new ManageImage(req.files["image"][0].path);
    const inputArray = await im.pathToArrayRGB();
    const deepcopyInputArray = JSON.parse(JSON.stringify(inputArray));

    const mainCreate = new LetsCreate(
      inputArray,
      boxes,
      originalFormat,
      processLogger
    );    
    
    const lzEncoder = new LZEncoder();

    const arrayToSend = mainCreate.mainCreate();
    imatge.exportInputArray(arrayToSend, `final_result_compress.${originalFormat}`).then(() => {
      lzEncoder.mainprova(deepcopyInputArray, arrayToSend).then(() => {
        const final = mainCreate.mainDecreate();

        imatge.exportInputArray(final.image, `final_result.${originalFormat}`);

        const proces = final.process;
        console.log(proces);

        const filePath = 'data.json';
        const data = JSON.stringify(proces, null, 2);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const existingData = JSON.parse(fileContent);
          existingData.push(proces);
          const updatedContent = JSON.stringify(existingData, null, 2);
          fs.writeFileSync(filePath, updatedContent);
        } else {
          fs.writeFileSync(filePath, `[${data}]`);
        }
        res.send(data);
        empty.deleteAll();
      });
    });

  }
);

app.post("/api/getFinalImage", upload.fields([{ name: "originalFormat" }]),async (req, res) => {
  const imatge = new ImageLoader();
  const format = req.body.originalFormat;

  const filePath = `final_result`;
  const enviar = await imatge.getReadyToSend(filePath, format);

  res.send(enviar);
});

app.post("/api/getImageCustom", upload.fields([{ name: "originalFormat" }, { name: "name" }]), async (req, res) => {
  
  const imatge = new ImageLoader();
  const format = req.body.originalFormat;
  const filePath = req.body.name;

  const enviar = await imatge.getReadyToSend(filePath, format);

  res.send(enviar);
});

app.post("/api/downloadDataFromJson", upload.fields([{ name: "formatToDownload" }]),async (req, res) => {
  
  const downloader = new DownloaderFromJson();
  const format = req.body.formatToDownload;
  
  const filePath = 'data.json';

  downloader.mainDownloader(format, filePath).then(()=>{

    // res.attachment(`data.${format}`);
    // res.send(data);
  });
});

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
