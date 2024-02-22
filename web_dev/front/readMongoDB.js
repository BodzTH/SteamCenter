const mongoose = require("mongoose");

const temphumlogs = require("../back/models/readings");
const devices = require("./models/devices");

const connection1 = mongoose.createConnection(
  "mongodb://localhost:27017/TempLogs"
);
const connection2 = mongoose.createConnection(
  "mongodb://localhost:27017/hardwareDB"
);

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

async function fetchAllDocs() {
  try {
    // Query all documents from 'temphumlogs' collection in db1
    const docs1 = await Model1.find({});
    console.log("Data from db1: ", docs1);

    // Query all documents from 'devices' collection in db2
    const docs2 = await Model2.find({});
    console.log("Data from db2: ", docs2);
  } catch (err) {
    console.error("Error occurred while querying databases: ", err);
  }
}

//fetchAllDocs();
