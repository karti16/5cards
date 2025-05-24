const express = require('express');
const app = express();
const path = require('path');

const port = 3000;

const testRouter = require('./routes/test.js');

app.use('/api/test', testRouter);
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

