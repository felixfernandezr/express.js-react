const express = require('express');
const app = express();
const port = 3000
 
app.get('/', (req, res) => {
  res.send('Successful response.');
});
 
app.listen(port, () => {
  console.log(`Example app is listening on port ${port}.`)
});
