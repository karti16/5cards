const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const port = 3000;

const groupRouter = require('./routes/group.js');
const playerRouter = require('./routes/player.js');
const roundsRouter = require('./routes/rounds.js');

app.use('/api/group', groupRouter);
app.use('/api/player', playerRouter);
app.use('/api/round', roundsRouter);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
