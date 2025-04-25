import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        toast.error('You must be logged in to view your appointments.');
        return setAppointments(getSampleAppointments());
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/appointments`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error.message);
        toast.error('Failed to fetch appointments. Using sample data.');
        setAppointments(getSampleAppointments());
      }
    };

    fetchAppointments();
  }, []);

  const handleDownloadPDF = (appointment) => {
    const doc = new jsPDF();
    doc.setFontSize(18).text('Cure Details', 14, 20);

    // Add appointment details
    doc.setFontSize(12);
    doc.text(`Dentist: ${appointment.dentistName || appointment.doctor?.name}`, 14, 30);
    doc.text(`Specialization: ${appointment.specialization || appointment.doctor?.speciality}`, 14, 40);
    doc.text(`Problem: ${appointment.problem}`, 14, 50);
    doc.text(`Date: ${new Date(appointment.date).toLocaleDateString()}`, 14, 60);
    doc.text(`Time: ${appointment.time || new Date(appointment.date).toLocaleTimeString()}`, 14, 70);

    // Add cures table
    if (appointment.cures?.length > 0) {
      const curesData = appointment.cures.map((cure, index) => [
        index + 1,
        cure.description,
        new Date(cure.date).toLocaleDateString(),
      ]);
      doc.autoTable({ head: [['#', 'Description', 'Date']], body: curesData, startY: 80 });
    } else {
      doc.text('No cures available.', 14, 80);
    }

    doc.save(`Cure_Details_${appointment.id || appointment._id}.pdf`);
  };

  const getSampleAppointments = () => [
    {
      id: 1,
      dentistName: 'Dr. John Doe',
      specialization: 'Orthodontist',
      date: '2025-04-30',
      time: '10:00 AM',
      status: 'Completed',
      problem: 'Severe toothache in the upper molar region',
      cures: [
        {
          description: 'Prescribed painkillers and antibiotics',
          image: 'https://via.placeholder.com/150',
          date: '2025-04-30',
        },
      ],
    },
    {
      id: 2,
      dentistName: 'Dr. Jane Smith',
      specialization: 'Periodontist',
      date: '2025-05-02',
      time: '2:00 PM',
      status: 'Pending',
      problem: 'Bleeding gums',
      cures: [],
    },
    {
      id: 3,
      dentistName: 'Dr. Emily Johnson',
      specialization: 'Pediatric Dentist',
      date: '2025-05-05',
      time: '11:30 AM',
      status: 'Cancelled',
      problem: 'Tooth decay in a child',
      cures: [],
    },
  ];

  const renderAppointmentCard = (appointment) => (
    <div
      key={appointment._id || appointment.id}
      className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
    >
      <h2 className="text-xl font-bold text-gray-800">{appointment.doctor?.name || appointment.dentistName}</h2>
      <p className="text-gray-600">{appointment.doctor?.speciality || appointment.specialization}</p>
      <p className="text-gray-600 mt-2">
        <strong>Problem:</strong> {appointment.problem}
      </p>
      <p className="text-gray-600 mt-2">
        <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
      </p>
      <p className="text-gray-600">
        <strong>Time:</strong> {appointment.time || new Date(appointment.date).toLocaleTimeString()}
      </p>
      <p
        className={`mt-4 font-bold ${
          appointment.status.toLowerCase() === 'completed'
            ? 'text-green-600'
            : appointment.status.toLowerCase() === 'pending'
            ? 'text-yellow-600'
            : 'text-red-600'
        }`}
      >
        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
      </p>
      {appointment.status.toLowerCase() === 'completed' && (
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
          onClick={() => setSelectedAppointment(appointment)}
        >
          Show Download Option
        </button>
      )}
      {selectedAppointment && selectedAppointment.id === appointment.id && (
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
          onClick={() => handleDownloadPDF(appointment)}
        >
          Download Cure Details
        </button>
      )}
    </div>
  );

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