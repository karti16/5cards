const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const port = 3000;

const groupRouter = require('./routes/group.js');
const playerRouter = require('./routes/player.js');
const roundsRouter = require('./routes/rounds.js');

app.use('/group', groupRouter);
app.use('/player', playerRouter);
app.use('/round', roundsRouter);


app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
