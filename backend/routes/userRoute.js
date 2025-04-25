
import express from 'express'
import { registerUser,verifyOtp,deleteUnverifiedUser,loginUser,bookAppointment,getUserAppointments} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'

const userRouter=express.Router()

userRouter.post('/register',registerUser);
userRouter.post('/verify-user',verifyOtp);
userRouter.delete('/users/:gmail', deleteUnverifiedUser);
userRouter.post('/login/',loginUser)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,getUserAppointments)


export default userRouter;
