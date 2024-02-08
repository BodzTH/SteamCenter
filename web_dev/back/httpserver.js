require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const temphumlogs = require("./models/readings");

app.use(express.json());

app.post("/temphum", async (req, res) => {
  const { temp, humidity, date } = req.body;
  try {
    const newTempHum = await temphumlogs.create({
      temp,
      humidity,
      date,
    });
    res.status(200).json(newTempHum);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/nextThum", (req, res) => {
  // res.json(temphum);
  res.json(temps);
  console.log(temps);
});

mongoose
  .connect("mongodb://localhost:27017/temp")
  .then(() => {
    const IP = process.env.IP; // replace with your desired IP
    const PORT = process.env.PORTHTTP; // replace with your desired HTTP port number
    app.listen(PORT, IP, () => {
      console.log(`Connected to DB & HTTP server is running on ${IP}:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
