import Doctor from '../models/doctorModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import validator from 'validator';
import Appointment from '../models/appointments.js';
import User from '../models/userModel.js';

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register a new doctor
export const registerDoctor = async (req, res) => {
  const { username, email, number, password, speciality } = req.body;

  try {
    // Map request body fields to model fields
    const name = username;
    const phoneNumber = number;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0 })) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one letter and one number',
      });
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate speciality
    if (!speciality || speciality.trim() === '') {
      return res.status(400).json({ message: 'Speciality is required for doctors' });
    }

    // Check if the email already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and expiry time
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // OTP expires in 2 minutes

    // Create a new doctor
    const newDoctor = new Doctor({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      speciality,
      role: 'doctor', // Explicitly set role to 'doctor'
      otp,
      otpExpiresAt,
    });

    // Save the doctor to the database
    await newDoctor.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is ${otp}. It is valid for 2 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error.message}`);
        return res.status(500).json({ message: 'Failed to send OTP email' });
      } else {
        console.log(`Email sent: ${info.response}`);
        res.status(201).json({ message: 'Doctor registered successfully. OTP sent to email.' });
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP for doctor
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {


    // Find the doctor by email
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if the OTP matches and is not expired
    if (doctor.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (doctor.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // OTP is valid; clear OTP fields
    doctor.otp = null;
    doctor.otpExpiresAt = null;
    await doctor.save();

    // Generate JWT token
    const token = jwt.sign({ id: doctor._id, role: doctor.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUnverifiedDoctor = async (req, res) => {
  const { email } = req.params;
  console.log('Email to delete:', email);

  try {
    // Find the doctor by email
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if the OTP has expired
    if (doctor.otpExpiresAt && doctor.otpExpiresAt < Date.now()) {
      // Delete the doctor if OTP has expired
      await Doctor.deleteOne({ email });
      console.log(`Deleted unverified doctor: ${email}`);
      return res.status(200).json({ message: 'Unverified doctor deleted successfully' });
    }

    res.status(400).json({ message: 'Doctor is either verified or OTP has not expired yet' });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login doctor
export const loginDoctor = async (req, res) => {
  const { email, password } = req.body;
 

  try {
    // Map request body fields to model fields
    

    // Find the doctor by email
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: doctor._id, role: doctor.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Respond with the token and doctor details
    res.status(200).json({
      message: 'Login successful',
      jwtToken: token,
      id: doctor._id,
      email: doctor.email,
      name: doctor.name,
      role: doctor.role,
      speciality: doctor.speciality,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all dentists
export const getAllDentists = async (req, res) => {
  try {
    // Fetch all doctors from the database
    const dentists = await Doctor.find(); // Filter by role if necessary
    res.status(200).json(dentists);
  } catch (error) {
    console.error(`Error fetching dentists: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch dentists' });
  }
};


export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.userId; // Extract doctorId from middleware
    console.log(doctorId)
    // Fetch appointments for the doctor
    const appointments = await Appointment.find({ doctorId });
    console.log(appointments)
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this doctor' });
    }

    // Fetch user details for each appointment
    const appointmentsWithUserDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const user = await User.findById(appointment.userId).select('name email phoneNumber');
        return {
          ...appointment._doc, // Spread the appointment details
          user, // Add the user details
        };
      })
    );
    console.log(appointmentsWithUserDetails)
    res.status(200).json(appointmentsWithUserDetails);
  } catch (error) {
    console.error(`Error fetching appointments: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};