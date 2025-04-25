import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
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
  speciality: {
    type: String,
    required: true, // Speciality is mandatory for doctors
    trim: true,
  },
  role: {
    type: String,
    default: 'doctor', // Role is explicitly set to 'doctor'
    enum: ['doctor'], // Ensures the role is always 'doctor'
    required: true,
  },
  otp: {
    type: String, // OTP is stored as a string
  },
  otpExpiresAt: {
    type: Date, // Expiry time for the OTP
  },
}, { timestamps: true });

const doctorModel = mongoose.model.Doctor || mongoose.model('Doctor', doctorSchema);

export default doctorModel;