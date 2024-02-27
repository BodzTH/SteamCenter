require("dotenv").config();
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const net = require("net");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const IP = process.env.IP2;
const PORT = process.env.PORTUDP1;
const TCP_PORT = process.env.PORTTCP;
server.bind({
  address: IP,
  port: PORT,
  exclusive: true,
});

// Database connections
const connection1 = mongoose.createConnection(
  "mongodb://localhost:27017/TempLogs"
);
const connection2 = mongoose.createConnection(
  "mongodb://localhost:27017/hardwareDB"
);

// Model imports
const temphumlogs = require("./models/readings");
const devices = require("../front/models/devices");

// Models setup
const Model1 = connection1.model("Model1", temphumlogs.schema, "temphumlogs");
const Model2 = connection2.model("Model2", devices.schema, "devices");

function isValidJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

function receiveFile(serverIp, serverPort, directoryPath, fileName) {
  const server = net.createServer((socket) => {
    console.log(
      `Accepted connection from ${socket.remoteAddress}:${socket.remotePort}`
    );

    // Ensure the directory exists
    fs.mkdirSync(directoryPath, { recursive: true });

    // Use the path module to join the directory path and the filename
    const outputPath = path.join(directoryPath, fileName);
    const fileStream = fs.createWriteStream(outputPath);

    console.log(`Saving file to ${outputPath}`);
    socket.on("data", (data) => {
      fileStream.write(data);
    });

    socket.on("end", () => {
      console.log("File received and saved.");
      fileStream.end();
    });

    socket.on("error", (err) => {
      console.error(`Connection error: ${err}`);
      fileStream.end();
    });
  });

  server.listen(serverPort, serverIp, () => {
    console.log(`TCP Server listening on ${serverIp}:${serverPort}`);
  });

  server.on("error", (err) => {
    console.error(`Server error: ${err}`);
  });
}

function createFileInDateDirectory(fileName, dateString) {
  // Parse the date string
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  // Construct the directory path
  const directoryPath = path.join(
    "home/bodz/2024_Noise_Recordings",
    year.toString(),
    month.toString(),
    day.toString()
  );

  // Ensure the directory exists
  fs.mkdirSync(directoryPath, { recursive: true });

  // Define the full path for the new file
  const filePath = path.join(directoryPath, fileName);

  // Create a placeholder file in the specified directory
  fs.writeFileSync(filePath, ""); // Initially, the file is empty

  console.log(`File '${fileName}' created at '${filePath}'`);

  // Return the full path of the created file
  return filePath;
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
    const waitForMessage = new Promise((resolve) => {
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
      const { data } = await waitForMessage;

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
  } else if (
    data.hasOwnProperty("Latitude") &&
    data.hasOwnProperty("Longitude") &&
    data.hasOwnProperty("date") &&
    data.hasOwnProperty("time") &&
    data.hasOwnProperty("deviceId") &&
    data.hasOwnProperty("filename")
  ) {
    let Latitude = parseFloat(data.Latitude);
    let Longitude = parseFloat(data.Longitude);
    let date = data.date;
    let time = data.time;
    let deviceId = data.deviceId;
    let fileName = String(data.filename);

    // const fullPath = createFileInDateDirectory(fileName, date);

    receiveFile(IP, TCP_PORT, "home/bodz/2024_Noise_Recordings", fileName);

    const newLog = new Model1({
      date: date,
      time: time,
    });

    try {
      // Save the new document to the database
      await newLog.save();
      // createDirectoriesAndSaveFiles(data);
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

connection1
  .on("connected", () => {
    console.log("Connected to TempLogs database.");
  })
  .on("error", (err) => {
    console.error("Error occurred in MongoDB connection to TempLogs: ", err);
  });

connection2
  .on("connected", () => {
    console.log("Connected to hardwareDB database.");
  })
  .on("error", (err) => {
    console.error("Error occurred in MongoDB connection to hardwareDB: ", err);
  });
