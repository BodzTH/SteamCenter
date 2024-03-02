const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
  },
  deviceId: {
    type: Number,
    required: true,
  },
  processUnit: {
    type: String,
    required: true,
  },
  wirelessModule: {
    type: String,
    required: true,
  },
  micModule: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  altitude: {
    type: Number,
    required: true,
  },
}, { toJSON: { getters: true }, toObject: { getters: true } });

module.exports = mongoose.model("devices", deviceSchema);
