import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'patient', // Default role is 'patient'
    enum: ['patient'], // Role can be either 'patient' or 'dentist'
    required: true,
  },
  otp: {
    type: String, // OTP is stored as a string
  },
  otpExpiresAt: {
    type: Date, // Expiry time for the OTP
  },
}, { timestamps: true });

const userModel = mongoose.model.User || mongoose.model('User', userSchema);

export default userModel;