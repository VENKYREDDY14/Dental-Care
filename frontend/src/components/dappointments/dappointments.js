import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Dheader from '../Dheader/Dheader'; // Import the header component

const DAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
      if (!jwtToken) {
        toast.error('You must be logged in to view your appointments.');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/appointments`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Pass the token in the Authorization header
          },
        });

        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error.message);
        toast.error('Failed to fetch appointments. Please try again.');
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
    <Dheader/>
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">My Appointments</h1>
        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold text-gray-800">{appointment.user.name}</h2>
                <p className="text-gray-600">
                  <strong>Email:</strong> {appointment.user.email}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {appointment.user.phoneNumber}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong> {new Date(appointment.date).toLocaleTimeString()}
                </p>
                <p
                  className={`mt-4 font-bold ${
                    appointment.status === 'confirmed'
                      ? 'text-green-600'
                      : appointment.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No appointments found.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default DAppointments;