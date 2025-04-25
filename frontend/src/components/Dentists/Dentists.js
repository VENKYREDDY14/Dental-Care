import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import { toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles

const dentistsample = [
  {
    id: 1,
    name: 'Dr. John Doe',
    specialization: 'Orthodontist',
    contact: 'john.doe@example.com',
    phone: '+1 123-456-7890',
    image: 'https://via.placeholder.com/300', // Replace with actual image URL
  },
  {
    id: 2,
    name: 'Dr. Jane Smith',
    specialization: 'Periodontist',
    contact: 'jane.smith@example.com',
    phone: '+1 987-654-3210',
    image: 'https://via.placeholder.com/300', // Replace with actual image URL
  },
  {
    id: 3,
    name: 'Dr. Emily Johnson',
    specialization: 'Pediatric Dentist',
    contact: 'emily.johnson@example.com',
    phone: '+1 555-123-4567',
    image: 'https://via.placeholder.com/300', // Replace with actual image URL
  },
];

const Dentists = () => {
  const [dentists, setDentists] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [problem, setProblem] = useState(''); // State to store the patient's problem

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/get-all-dentists`);
        setDentists(response.data);
      } catch (error) {
        console.error('Error fetching dentists:', error.message);
        setDentists(dentistsample); // Fallback to static data if API fails
      }
    };

    fetchDentists();
  }, []);

  const handleImageClick = (dentist) => {
    setSelectedDentist(dentist);
  };

  const closeModal = () => {
    setSelectedDentist(null);
    setProblem(''); // Reset the problem field when closing the modal
  };

  const handleBookAppointment = async () => {
    const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
    if (!jwtToken) {
      toast.error('You must be logged in to book an appointment.'); // Show error toast
      return;
    }

    if (!problem.trim()) {
      toast.error('Please describe your problem before booking an appointment.'); // Show error toast
      return;
    }

    const appointmentDetails = {
      doctorId: selectedDentist._id,
      date: new Date().toISOString(), // Current date and time
      problem, // Include the patient's problem
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/book-appointment`,
        appointmentDetails,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Pass the token in the Authorization header
          },
        }
      );

      if (response.status === 201) {
        toast.success('Appointment booked successfully!'); // Show success toast
        closeModal();
      }
    } catch (error) {
      console.error('Error booking appointment:', error.message);
      toast.error('Failed to book appointment. Please try again.'); // Show error toast
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">Our Dentists</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dentists.map((dentist) => (
              <div
                key={dentist.id || dentist._id} // Use static ID or dynamic ID
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
              >
                <img
                  src={dentist.image || 'https://via.placeholder.com/300'} // Use placeholder if no image
                  alt={dentist.name}
                  className="w-full h-60 object-cover rounded-lg mb-6 cursor-pointer"
                  onClick={() => handleImageClick(dentist)}
                />
                <h2 className="text-2xl font-bold text-gray-800">{dentist.name}</h2>
                <p className="text-gray-600 text-lg">{dentist.specialization || dentist.speciality}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Booking Appointment */}
        {selectedDentist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Book Appointment with {selectedDentist.name}
              </h2>
              <p className="text-gray-600 mb-4">
                <strong>Specialization:</strong> {selectedDentist.specialization || selectedDentist.speciality}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Email:</strong> {selectedDentist.contact || selectedDentist.email}
              </p>
              <p className="text-gray-600 mb-6">
                <strong>Phone:</strong> {selectedDentist.phone}
              </p>
              <textarea
                className="w-full p-3 border rounded-lg mb-4"
                placeholder="Describe your problem..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              ></textarea>
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full"
                onClick={handleBookAppointment}
              >
                Confirm Appointment
              </button>
              <button
                className="mt-4 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition w-full"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dentists;