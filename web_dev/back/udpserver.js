require("dotenv").config();
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const mongoose = require("mongoose");

const temphumlogs = require("./models/readings");
const devices = require("../front/models/devices");

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

server.on("message", async (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  // Parse the incoming message as JSON
  let data;
  try {
    data = JSON.parse(msg);
  } catch (err) {
    console.error(`Error parsing message as JSON: ${err.message}`);
    return;
  }

  // Check if the JSON object has a checkId property
  if (data.hasOwnProperty("checkId")) {
    let checkId = data.checkId;
    console.log(`Received checkId: ${checkId}`);
    if (checkId) {
      // Send an "OK" message back
      const response = "OK";
      server.send(response, rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error(`Error sending response: ${err.message}`);
        } else {
          console.log(`Sent response: ${response}`);
        }
      });
    }
  }
  // Check if the JSON object has Humidity, Temperature, Latitude, Longitude, date, and time properties
  else if (
    data.hasOwnProperty("Humidity") &&
    data.hasOwnProperty("Temperature") &&
    data.hasOwnProperty("Latitude") &&
    data.hasOwnProperty("Longitude") &&
    data.hasOwnProperty("date") &&
    data.hasOwnProperty("time")
  ) {
    let humidity = data.Humidity;
    let temperature = data.Temperature;
    let latitude = data.Latitude;
    let longitude = data.Longitude;
    let date = data.date;
    let time = data.time;
  }
});

connection1.on("connected", () => {
  server.on("listening", () => {
    const address = server.address();
    console.log(
      `Connected to DB & UDP server listening on ${address.address}:${address.port}`
    );
  });
  console.log("Connected to TempLogs");
});

connection1.on("error", (err) => {
  console.error("Error occurred in MongoDB connection1: ", err);
});

connection2.on("connected", () => {
  server.on("listening", () => {
    const address = server.address();
    console.log(
      `Connected to DB & UDP server listening on ${address.address}:${address.port}`
    );
  });
  console.log("Connected to hardwareDB");
});

connection2.on("error", (err) => {
  console.error("Error occurred in MongoDB connection2: ", err);
});

server.on("error", (err) => {
  console.error("Error occurred in UDP server: ", err);
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

fetchAllDocs();

const IP = process.env.IP2;
const PORT = process.env.PORTUDP1;
server.bind({
  address: IP,
  port: PORT,
  exclusive: true,
});
