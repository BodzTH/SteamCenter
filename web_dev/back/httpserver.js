const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.text());
app.use(cors());
app.use(express.json());

let temphum = [];

//
app.post("/temphum", (req, res) => {
  const data = req.body;

  if (!temphum.includes(data)) {
    temphum.push(data);
  }

  console.log(temphum);
});

app.get("/nextThum", (req, res) => {
  // res.json(temphum);
  res.send(new Buffer("wahoo"));
});

const IP = process.env.IP; // replace with your desired IP
const PORT = process.env.PORTHTTP; // replace with your desired HTTP port number
app.listen(PORT, IP, () => {
  console.log(`Server is running on ${IP}:${PORT}`);
});
process.env;
