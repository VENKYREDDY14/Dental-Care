import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import 'react-toastify/dist/ReactToastify.css';

const Dentists = () => {
  const [dentists, setDentists] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/get-all-dentists`);
        setDentists(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dentists:', error.message);
        setError('Failed to fetch dentists. Please try again.');
        setLoading(false);
      }
    };

    fetchDentists();
  }, []);

  const handleImageClick = (dentist) => {
    setSelectedDentist(dentist);
  };

  const closeModal = () => {
    setSelectedDentist(null);
    setProblem('');
  };

  const handleBookAppointment = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      toast.error('You must be logged in to book an appointment.');
      return;
    }

    if (!problem.trim()) {
      toast.error('Please describe your problem before booking an appointment.');
      return;
    }

    const appointmentDetails = {
      doctorId: selectedDentist._id,
      date: new Date().toISOString(),
      problem,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/book-appointment`,
        appointmentDetails,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success('Appointment booked successfully!');
        closeModal();
      }
    } catch (error) {
      console.error('Error booking appointment:', error.message);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDots color="#0b69ff" height={50} width={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <img
          alt="error view"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          className="w-[300px] h-[165px] sm:w-[200px] sm:h-[110px] md:w-[250px] md:h-[140px]"
        />
        <h1 className="text-xl font-bold text-red-500 mt-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">Our Dentists</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dentists.map((dentist) => (
              <div
                key={dentist.id || dentist._id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
              >
                <img
                  src={dentist.image || 'https://res.cloudinary.com/dsad92ak9/image/upload/exhweklkgyai6qwvm54z'}
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
                <strong>Phone:</strong> {selectedDentist.phoneNumber}
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