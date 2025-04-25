import User from '../models/userModel.js';
import Appointment from '../models/appointments.js'; // Import the Appointments model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import validator from 'validator';
import Doctor from '../models/doctorModel.js'; // Import the Doctor model

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

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, number, password, role } = req.body;

  try {
    const name = username;
    const phoneNumber = number;

    // Validate name
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: 'Name must be at least 3 characters long' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate password
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0 })) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one letter and one number',
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and expiry time
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: role || 'patient',
      otp,
      otpExpiresAt,
    });

    // Save the user to the database
    await newUser.save();

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
        res.status(201).json({ message: 'User registered successfully. OTP sent to email.' });
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete unverified user
export const deleteUnverifiedUser = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otpExpiresAt && user.otpExpiresAt < Date.now()) {
      await User.deleteOne({ email });
      console.log(`Deleted unverified user: ${email}`);
      return res.status(200).json({ message: 'Unverified user deleted successfully' });
    }

    res.status(400).json({ message: 'User is either verified or OTP has not expired yet' });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      jwtToken: token,
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'patient',
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
  const { userId } = req;
  const { doctorId } = req.body;

  try {
    if (!userId || !doctorId) {
      return res.status(400).json({ message: 'User ID and Doctor ID are required' });
    }

    const newAppointment = new Appointment({
      userId,
      doctorId,
      status: 'pending',
    });

    await newAppointment.save();

    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    console.error(`Error booking appointment: ${error.message}`);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
};

// Get appointments for a specific user
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch appointments for the user
    const appointments = await Appointment.find({ userId });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }

    // Fetch doctor details for each appointment
    const appointmentsWithDoctorDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await Doctor.findById(appointment.doctorId).select('name speciality email phoneNumber');
        return {
          ...appointment._doc, // Spread the appointment details
          doctor, // Add the doctor details
        };
      })
    );

    res.status(200).json(appointmentsWithDoctorDetails);
  } catch (error) {
    console.error(`Error fetching appointments: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};