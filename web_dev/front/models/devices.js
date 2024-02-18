const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
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
  place: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  coverage: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("devices", deviceSchema);
