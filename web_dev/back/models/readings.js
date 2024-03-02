const mongoose = require("mongoose");

const noiseDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("NoiseData", noiseDataSchema);
