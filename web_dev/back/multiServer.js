require("dotenv").config();
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const net = require("net");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { spawn } = require("child_process");

const IP = process.env.IP2;
const PORT = process.env.PORTUDP1;
const TCP_PORT = process.env.PORTTCP;
server.bind({
  address: IP,
  port: PORT,
  exclusive: true,
});

// Database connections
const connection1 = mongoose.createConnection(process.env.NOISEDOCS_DB_URI);
const connection2 = mongoose.createConnection(process.env.HARDWAREDB_DB_URI);

// Model imports
const noiseData = require("./models/readings");
const devices = require("./models/devices");

// Models setup
const Model1 = connection1.model("Model1", noiseData.schema, "noiseData");
const Model2 = connection2.model("Model2", devices.schema, "devices");

function receiveFile(serverIp, serverPort, directoryPath, fileName) {
  return new Promise((resolve, reject) => {
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
        server.close();
        resolve(outputPath); // Resolve the Promise with the outputPath
      });

      socket.on("error", (err) => {
        console.error(`Connection error: ${err}`);
        fileStream.end();
        server.close();
        reject(err); // Reject the Promise with the error
      });
    });

    server.listen(serverPort, serverIp, () => {
      console.log(`TCP Server listening on ${serverIp}:${serverPort}`);
    });

    server.on("error", (err) => {
      console.error(`Server error: ${err}`);
      reject(err); // Reject the Promise with the error
    });
  });
}

function createDirectoryInDateDirectory(directoryName, dateString, deviceName) {
  // Parse the date string
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" }); // Full month name
  const day = date.getDate();

  // Format day and year for the directory name
  const monthShort = date.toLocaleString("default", { month: "short" }); // Short month name
  const dayYearFolderName = `${monthShort}${day}_${year.toString().slice(-2)}`; // e.g., Feb25_24

  // Construct the directory path
  const directoryPath = path.resolve(
    "/home/bodz/AIO_Project/",
    "2024_Noise_Recordings",
    deviceName,
    month, // Use the full month name
    dayYearFolderName, // Use the formatted day and year name
    directoryName // Add the directoryName to the path
  );

  // Ensure the directory exists
  fs.mkdirSync(directoryPath, { recursive: true });

  console.log(`Directory '${directoryName}' created at '${directoryPath}'`);

  // Return the full path of the created directory
  return directoryPath;
}

function createJsonFile(folderPath, data) {
  // Ensure the directory exists
  fs.mkdirSync(folderPath, { recursive: true });

  // Create the JSON file path
  const filePath = path.join(folderPath, "data.json");

  // Convert the data object to a JSON string
  const jsonData = JSON.stringify(data, null, 2);

  // Write the JSON string to a file
  fs.writeFileSync(filePath, jsonData);

  console.log(`JSON file has been saved to ${filePath}`);
}

server.on("message", async (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

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

    let response = device ? "OK" : "NO";

    server.send(response, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error(`Error sending response: ${err.message}`);
      } else {
        console.log(`Sent response: ${response}`);
      }
    });
  } else if (
    data.hasOwnProperty("deviceId") &&
    data.hasOwnProperty("deviceName") &&
    data.hasOwnProperty("processUnit") &&
    data.hasOwnProperty("wirelessModule") &&
    data.hasOwnProperty("micModule") &&
    data.hasOwnProperty("image") &&
    data.hasOwnProperty("Latitude") &&
    data.hasOwnProperty("Longitude") &&
    data.hasOwnProperty("Altitude")
  ) {
    try {
      let newDevice = await Model2.create({
        processUnit: data.processUnit,
        wirelessModule: data.wirelessModule,
        micModule: data.micModule,
        coverage: data.coverage,
        deviceName: data.deviceName,
        deviceId: data.deviceId,
        image: data.image,
        latitude: parseFloat(data.Latitude),
        longitude: parseFloat(data.Longitude),
        altitude: parseFloat(data.Altitude),
      });

      console.log(`New device created: ${JSON.stringify(newDevice)}`);
    } catch (err) {
      console.error(`Error creating new device: ${err.message}`);
    }
  } else if (
    data.hasOwnProperty("Latitude") &&
    data.hasOwnProperty("Longitude") &&
    data.hasOwnProperty("Altitude") &&
    data.hasOwnProperty("date") &&
    data.hasOwnProperty("time") &&
    data.hasOwnProperty("deviceId") &&
    data.hasOwnProperty("filename")
  ) {
    const Latitude = parseFloat(data.Latitude);
    const Longitude = parseFloat(data.Longitude);
    const Altitude = parseFloat(data.Altitude);
    const date = data.date;
    const time = data.time;
    const deviceId = data.deviceId;
    let folderName = data.filename;
    let fileName = data.filename;
    // Remove the leading slash
    if (folderName.startsWith("/")) {
      folderName = folderName.slice(1);
    }

    // Remove the .wav extension
    folderName = folderName.replace(".wav", "");

    console.log(folderName); // Outputs: Noise1
    const device = await Model2.findOne({ deviceId: deviceId });
    const folderPath = createDirectoryInDateDirectory(
      folderName,
      date,
      device.deviceName
    );

    async function handleFileReception(IP, TCP_PORT, folderPath, fileName) {
      try {
        const outputPath = await receiveFile(
          IP,
          TCP_PORT,
          folderPath,
          fileName
        );
        console.log(outputPath);

        // Assuming date and time are defined elsewhere in your code
        const newLog = new Model1({
          deviceId: deviceId,
          date: date,
          time: time,
          filepath: outputPath,
        });

        // Save the new document to the database
        await newLog.save();
        console.log("New log saved to TempLogs database.");

        // Return the output path
        return outputPath;
      } catch (err) {
        console.error(`An error occurred: ${err}`);
      }
    }
    handleFileReception(IP, TCP_PORT, folderPath, fileName)
      .then((outputPath) => {
        console.log("Output path:", outputPath);

        // Run the Python script with outputPath as an argument
        const pythonProcess = spawn("/home/bodz/speechbrain_env/bin/python", ["/home/bodz/AIO_Project/urban8K_AI_Model/classifier.py", outputPath]);

        // Handle output
        pythonProcess.stdout.on("data", (data) => {
          console.log(`Python script output: ${data}`);
        });

        // Handle error
        pythonProcess.stderr.on("data", (data) => {
          console.error(`Python script error: ${data}`);
        });
      })
      .catch((err) => {
        console.error("An error occurred:", err);
      });

    createJsonFile(folderPath, data);

    // Update the 'devices' document with deviceId 1
    try {
      await Model2.updateOne(
        { deviceId: deviceId },
        {
          $set: {
            latitude: Latitude,
            longitude: Longitude,
            altitude: Altitude,
          },
        }
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
