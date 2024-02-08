const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const htmlResponse = `
    <html>
      <head>
        <title>API-TFG</title>
      </head>
      <body>
        <h1>Aquesta és la api del TFG</h1>
      </body>
    </html>
  `;
  res.send(htmlResponse);
});

app.listen(port, () => {
  console.log(`port runing in https://api-tfg.vercel.app/`);
});

module.exports = app;