const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  coverage: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  longitude: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  altitude: {
    type: Schema.Types.Decimal128,
    required: true,
  },
});

module.exports = mongoose.model("devices", deviceSchema);
