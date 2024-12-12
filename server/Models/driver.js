const mongoose = require('mongoose');

// Define the schema for the Driver
const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true,
  },
  dropOffLocation: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create the model using the schema
const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
