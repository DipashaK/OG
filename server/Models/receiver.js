const mongoose = require('mongoose');

const receiverSchema = new mongoose.Schema({
  receiverName: { type: String, required: true},
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  email: { type: String, required: true, match: /^[a-zA-Z0-9._%+-]+@gmail\.com$/  },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other']  },
  organ: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  status: { type: String, default: "Pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Receiver', receiverSchema);