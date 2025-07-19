const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.json());
const isGroupInDB = require('./db/index.js').isGroupInDB;

const port = 3000;

const groupRouter = require("./routes/group.js");
const playerRouter = require("./routes/player.js");
const roundsRouter = require("./routes/rounds.js");

app.use("/api/group", groupRouter);
app.use("/api/player", playerRouter);
app.use("/api/round", roundsRouter);

app.use(
  "/api/health",
  router.get("/", (req, res) => {
    res.send({ status: "healthy!!!000!" });
  }),
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  isGroupInDB("knft1")
});
