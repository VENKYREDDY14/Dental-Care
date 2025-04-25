import express from 'express';
import { registerDoctor, verifyOtp, deleteUnverifiedDoctor, loginDoctor,getAllDentists,getDoctorAppointments} from '../controllers/doctorController.js';
import authUser from '../middlewares/authUser.js';

const doctorRouter = express.Router();

doctorRouter.post('/register', registerDoctor);
doctorRouter.post('/verify-doctor', verifyOtp);
doctorRouter.delete('/doctors/:gmail', deleteUnverifiedDoctor);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/get-all-dentists',getAllDentists);
doctorRouter.get('/appointments', authUser, getDoctorAppointments); // Fetch appointments for the logged-in doctor

export default doctorRouter;