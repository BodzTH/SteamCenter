require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json()); // For parsing application/json
app.use(cors());

// If you convert readings.js and devices.ts to use ES Module syntax
const temphumlogs = require("./models/readings");
const devices = require("./models/devices");

const connection1 = mongoose.createConnection(process.env.TEMPLOGS_DB_URI);
const connection2 = mongoose.createConnection(process.env.HARDWAREDB_DB_URI);

const temphumlogsSchema = temphumlogs.schema;
const devicesSchema = devices.schema;

// Define a model for collection 'temphumlogs' in db1
const Model1 = connection1.model("Model1", temphumlogsSchema, "temphumlogs");

// Define a model for collection 'devices' in db2
const Model2 = connection2.model("Model2", devicesSchema, "devices");

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

const port = process.env.PORTHTTP; // Set the port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
