const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema);