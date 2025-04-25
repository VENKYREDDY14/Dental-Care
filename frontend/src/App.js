import React from 'react'
import Login from './components/Login/Login'
import Header from './components/Header/Header'
import Register from './components/Register/Register'
import {Routes,Route} from 'react-router-dom'
import Dentists from './components/Dentists/Dentists'
import Appointments from './components/Appointments/Appointments'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home/Home'
import Dashboard from './components/DoctorDashboard/Dashboard'
import DAppointments from './components/dappointments/dappointments'
const App = () => {
  return (
    <div>
      <ToastContainer/>
     
      <Routes>
        <Route path='/' element={<Home/>}/>
       <Route path='/login' element={<Login/>}/>
       <Route path='/register' element={<Register/>}/>
       <Route path='/Dentists' element={<Dentists/>}/>  
       <Route path='/appointments' element={<Appointments/>}/>
       <Route path="/doctor-dashboard" element={<Dashboard/>}/>
       <Route path="/dappointments" element={<DAppointments/>}/>
      </Routes>
    </div>
  )
}

export default App