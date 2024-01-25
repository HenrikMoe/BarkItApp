// index.js
const express = require('express');
const app = express();
const port = 3010;

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
