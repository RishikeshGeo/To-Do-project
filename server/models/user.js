const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  hashedPassword: {
    type: String,
    required: true
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('user', userSchema)