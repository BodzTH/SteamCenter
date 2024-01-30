const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.text()); // Parse plain text bodies
app.use(cors());
app.use(express.json());

let temphum = [];

app.post("/temphum", (req, res) => {
  const data = req.body; // Assuming the request body contains the data to be pushed

  // Check if the data already exists in the temphum array
  if (!temphum.includes(data)) {
    temphum.push(data); // Push the data into the temphum array
  }

  res.sendStatus(200); // Send a 200 status code
  console.log(temphum);
});

app.get("/nextThum", async (req, res) => {
  try {
    res.json(temphum);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const IP = "192.168.1.7"; // replace with your desired IP
const PORT = 5030;
app.listen(PORT, IP, () => {
  console.log(`Server is running on ${IP}:${PORT}`);
});
