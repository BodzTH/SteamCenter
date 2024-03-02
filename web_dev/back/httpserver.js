require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json()); // For parsing application/json
app.use(cors());

// Database connections
const connection1 = mongoose.createConnection(process.env.NOISEDOCS_DB_URI);
const connection2 = mongoose.createConnection(process.env.HARDWAREDB_DB_URI);

// Model imports
const noiseData = require("./models/readings");
const devices = require("./models/devices");

// Models setup
const Model1 = connection1.model("Model1", noiseData.schema, "noiseData");
const Model2 = connection2.model("Model2", devices.schema, "devices");

connection1.on("connected", () => {
  console.log("Connected to TempLogs");
});

connection1.on("error", (err) => {
  console.error("Error occurred in MongoDB connection1: ", err);
});

connection2.on("connected", () => {
  console.log("Connected to hardwareDB");
});

connection2.on("error", (err) => {
  console.error("Error occurred in MongoDB connection2: ", err);
});

app.get("/location/:id", async (req, res) => {
  console.log("Handler reached", req.params.id); // Check if the handler is reached
  try {
    const device = await Model2.findOne({ deviceId: req.params.id });
    console.log(device);
    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/device/:id", async (req, res) => {
  try {
    const device = await Model2.findOne({ deviceId: req.params.id });
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORTHTTP; // Set the port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
