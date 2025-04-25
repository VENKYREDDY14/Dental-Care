import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the User model
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor', // Reference to the Doctor model
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Appointment date is required
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'], // Appointment status
    default: 'pending',
  },
  problem: {
    type: String, // Description of the patient's problem
    required: true,
    trim: true,
  },
  cures: [
    {
      description: {
        type: String, // Description of the cure or treatment
        required: true,
        trim: true,
      },
      image: {
        type: String, // URL or path to the image for the cure
        required: false,
      },
      date: {
        type: Date, // Date when the cure was provided
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

const appointmentModel = mongoose.models.Appointments || mongoose.model('Appointments', appointmentSchema);

export default appointmentModel;

