import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        toast.error('You must be logged in to view your appointments.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/appointments`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch appointments. Please try again.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDownloadPDF = (appointment) => {
    const doc = new jsPDF();
    doc.setFontSize(18).text('Appointment Details', 14, 20);
    doc.setFontSize(12);
    doc.text(`Patient Name: ${appointment.user?.name || 'N/A'}`, 14, 30);
    doc.text(`Patient Contact: ${appointment.user?.phoneNumber || 'N/A'}`, 14, 40);
    doc.text(`Doctor: ${appointment.doctor?.name || 'N/A'}`, 14, 50);
    doc.text(`Specialization: ${appointment.doctor?.speciality || 'N/A'}`, 14, 60);
    doc.text(`Problem: ${appointment.problem || 'N/A'}`, 14, 70);
    doc.text(`Date: ${new Date(appointment.date).toLocaleDateString() || 'N/A'}`, 14, 80);
    doc.text(`Status: ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`, 14, 90);

    if (appointment.cures && appointment.cures.length > 0) {
      doc.text('Cures:', 14, 100);
      appointment.cures.forEach((cure, index) => {
        doc.text(`${index + 1}. ${cure.description}`, 14, 110 + index * 10);
        if (cure.image) {
          const img = new Image();
          img.src = cure.image;
          doc.addImage(img, 'JPEG', 14, 120 + index * 20, 50, 50);
        }
      });
    }

    doc.save(`Appointment_${appointment._id}.pdf`);
  };

  const renderAppointmentCard = (appointment) => (
    <div
      key={appointment._id}
      className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
    >
      <h2 className="text-xl font-bold text-gray-800">{appointment.doctor?.name}</h2>
      <p className="text-gray-600">{appointment.doctor?.speciality}</p>
      <p className="text-gray-600 mt-2">
        <strong>Problem:</strong> {appointment.problem}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
      </p>
      <p
        className={`mt-4 font-bold ${
          appointment.status.toLowerCase() === 'completed'
            ? 'text-green-600'
            : 'text-gray-600'
        }`}
      >
        <strong>Status:</strong> {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
      </p>
      {appointment.status.toLowerCase() === 'completed' && (
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
          onClick={() => handleDownloadPDF(appointment)}
        >
          Download PDF
        </button>
      )}
    </div>
  );

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
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">My Appointments</h1>
          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map(renderAppointmentCard)}
            </div>
          ) : (
            <p className="text-center text-gray-600">No appointments booked yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Appointments;