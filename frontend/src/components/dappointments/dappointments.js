import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Dheader from '../Dheader/Dheader'; // Import the header component

const DAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State for selected appointment
  const [cureDescription, setCureDescription] = useState(''); // State for cure description
  const [cureImage, setCureImage] = useState(null); // State for cure image

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

  const handleCureClick = (appointment) => {
    setSelectedAppointment(appointment); // Open the popup for the selected appointment
  };

  const handleCureSubmit = async () => {
    if (!cureDescription.trim()) {
      toast.error('Please provide a description for the cure.');
      return;
    }

    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      toast.error('You must be logged in to submit a cure.');
      return;
    }

    const formData = new FormData();
    formData.append('description', cureDescription);
    if (cureImage) {
      formData.append('image', cureImage);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/doctor/appointments/${selectedAppointment._id}/add-cure`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Cure added successfully!');
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === selectedAppointment._id
              ? { ...appointment, status: 'completed', cures: [...appointment.cures, response.data.cure] }
              : appointment
          )
        );
        setSelectedAppointment(null); // Close the popup
        setCureDescription('');
        setCureImage(null);
      }
    } catch (error) {
      console.error('Error adding cure:', error.message);
      toast.error('Failed to add cure. Please try again.');
    }
  };

  return (
    <>
      <Dheader />
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
                  <p className="text-gray-600 mt-2">
                    <strong>Problem:</strong> {appointment.problem}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Time:</strong> {new Date(appointment.date).toLocaleTimeString()}
                  </p>
                  <p
                    className={`mt-4 font-bold ${
                      appointment.status === 'completed'
                        ? 'text-green-600'
                        : appointment.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </p>
                  <button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
                    onClick={() => handleCureClick(appointment)}
                  >
                    Add Cure
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No appointments found.</p>
          )}
        </div>
      </div>

      {/* Cure Popup */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Cure</h2>
            <p className="text-gray-600 mb-4">
              <strong>Patient:</strong> {selectedAppointment.user.name}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Problem:</strong> {selectedAppointment.problem}
            </p>
            <textarea
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Enter cure description..."
              value={cureDescription}
              onChange={(e) => setCureDescription(e.target.value)}
            ></textarea>
            <input
              type="file"
              className="w-full mb-4"
              onChange={(e) => setCureImage(e.target.files[0])}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
              onClick={handleCureSubmit}
            >
              Submit Cure
            </button>
            <button
              className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition w-full"
              onClick={() => setSelectedAppointment(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DAppointments;