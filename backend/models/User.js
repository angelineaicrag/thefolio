// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' },
}, { timestamps: true });

// Hash password before saving - SIMPLE VERSION without next
userSchema.pre('save', function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = function(enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);