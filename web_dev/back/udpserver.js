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
function isValidJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
server.on("message", async (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  if (!isValidJson(msg)) {
    console.error(`Received message is not valid JSON: ${msg}`);
    return;
  }

  let data;
  try {
    data = JSON.parse(msg);
  } catch (err) {
    console.error(`Error parsing message: ${err.message}`);
    return;
  }

  if (
    !data.hasOwnProperty("deviceName") &&
    data.hasOwnProperty("deviceId") &&
    !data.hasOwnProperty("date") &&
    !data.hasOwnProperty("time")
  ) {
    let deviceId = data.deviceId;
    console.log(`Received deviceId: ${deviceId}`);

    let device;
    try {
      device = await Model2.findOne({ deviceId: deviceId });
    } catch (err) {
      console.error(`Error querying devices collection: ${err.message}`);
      return;
    }

    let response;
    if (device) {
      response = "OK";
    } else {
      response = "NO";
    }

    // Wrap server.send in a Promise
    const sendResponse = new Promise((resolve, reject) => {
      server.send(response, rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error(`Error sending response: ${err.message}`);
          reject(err);
        } else {
          console.log(`Sent response: ${response}`);
          resolve();
        }
      });
    });

    try {
      // Wait for the response to be sent before proceeding
      await sendResponse;
    } catch (err) {
      console.error(`Error sending response: ${err.message}`);
      return;
    }

    // Wrap server.on("message") in a Promise
    const waitForMessage = new Promise((resolve, reject) => {
      server.on("message", (msg, rinfo) => {
        if (!isValidJson(msg)) {
          console.error(`Received message is not valid JSON: ${msg}`);
          return;
        }

        let data;
        try {
          data = JSON.parse(msg);
        } catch (err) {
          console.error(`Error parsing message: ${err.message}`);
          return;
        }

        if (
          data.hasOwnProperty("processUnit") &&
          data.hasOwnProperty("wirelessModule") &&
          data.hasOwnProperty("micModule") &&
          data.hasOwnProperty("coverage") &&
          data.hasOwnProperty("deviceName") &&
          data.hasOwnProperty("image") &&
          data.hasOwnProperty("Latitude") &&
          data.hasOwnProperty("Longitude")
        ) {
          resolve({ data, rinfo });
        }
      });
    });

    try {
      const { data, rinfo } = await waitForMessage;

      let newDevice = new Model2({
        processUnit: data.processUnit,
        wirelessModule: data.wirelessModule,
        micModule: data.micModule,
        coverage: data.coverage,
        deviceName: data.deviceName,
        deviceId: data.deviceId,
        image: data.image,
        latitude: data.Latitude,
        longitude: data.Longitude,
      });

      try {
        await newDevice.save();
        console.log(`Saved new device: ${JSON.stringify(newDevice)}`);
      } catch (err) {
        console.error(`Error saving new device: ${err.message}`);
      }
    } catch (err) {
      console.error(`Error waiting for message: ${err.message}`);
    }
  }
  // Check if the JSON object has Humidity, Temperature, Latitude, Longitude, date, and time properties
  else if (
    data.hasOwnProperty("Latitude") &&
    data.hasOwnProperty("Longitude") &&
    data.hasOwnProperty("date") &&
    data.hasOwnProperty("time") &&
    data.hasOwnProperty("deviceId") // Ensure deviceId is in the data
  ) {
    let Latitude = parseFloat(data.Latitude);
    let Longitude = parseFloat(data.Longitude);
    let date = data.date;
    let time = data.time;
    let deviceId = data.deviceId; // Update deviceId from the data

    // Create a new document in the 'temphumlogs' collection
    const newLog = new Model1({
      date: date,
      time: time,
    });

    try {
      // Save the new document to the database
      await newLog.save();
      console.log("New log saved to TempLogs database.");
    } catch (err) {
      console.error(
        `Error saving new log to TempLogs database: ${err.message}`
      );
    }

    // Update the 'devices' document with deviceId 1
    try {
      await Model2.updateOne(
        { deviceId: deviceId },
        { $set: { latitude: Latitude, longitude: Longitude } }
      );
      console.log("Device location updated in hardwareDB database.");
    } catch (err) {
      console.error(
        `Error updating device location in hardwareDB database: ${err.message}`
      );
    }
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

// fetchAllDocs();

const IP = process.env.IP2;
const PORT = process.env.PORTUDP1;
server.bind({
  address: IP,
  port: PORT,
  exclusive: true,
});
