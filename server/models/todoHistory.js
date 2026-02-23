const mongoose = require('mongoose');

const todoHistorySchema = new mongoose.Schema({
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deletedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('TodoHistory', todoHistorySchema);
