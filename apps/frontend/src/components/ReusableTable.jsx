import React, { useState } from 'react';
import AppointmentModal from './AppointmentModal';
import { Button } from '../utils/components';
import '../App.css'

const ReusableTable = ({ doctors, appointments, loggedInUser, handlePageChange, pagination, setAppointments }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const filteredAppointments = loggedInUser.role === 'admin'
    ? appointments
    : appointments.filter((appointment) => appointment.doctorId === loggedInUser.id);
  const getDoctorName = (id) => {
    const doctor = doctors.find(doctor => doctor.id === id);
    return doctor ? doctor.name : 'Unknown Doctor';
  }
  function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  const handleEditOpen = (appointment) => {
    setSelectedAppointment(appointment)
    setIsEditOpen(true)

  }
  const handleModalClose = () => {
    setIsEditOpen(false)
    setSelectedAppointment(null)
  }
  return (
    <>
    <table className="table">
      <thead>
        <tr>
          {loggedInUser.role === 'admin' && <th className="table-header">Doctor Name</th>}
          <th className="table-header">Patient Name</th>
          <th className="table-header">Date</th>
          <th className="table-header">Time</th>
          <th className="table-header">Appointment Type</th>
          <th className="table-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredAppointments.map((appointment) => (
          <>
          <tr key={appointment.id}>
            {loggedInUser.role === 'admin' && (
              <td className="table-cell">{getDoctorName(appointment.doctorId)}</td>
            )}
            <td className="table-cell">{appointment.patientName}</td>
            <td className="table-cell">{formatDate(appointment.date)}</td>
            <td className="table-cell">{appointment.time}</td>
            <td className="table-cell">{appointment.appointmentType}</td>
            <td className="table-cell">
              <div className="actions">
                <Button color={'#0288d1'}>View</Button>
                
                <Button color={'#43a047'} handleSubmit={() => handleEditOpen(appointment)}>Edit</Button>
                <Button color={'#bf360c'}>Delete</Button>
              </div>
            </td>
          </tr>
            </>
        ))}
      </tbody>
    </table>
    {isEditOpen && 
      <AppointmentModal 
        isOpen={isEditOpen}
        initialData={selectedAppointment}
        onClose={handleModalClose}
        appointments={appointments}
        setAppointments={setAppointments}
        loggedInUser={loggedInUser}
      />}
    <div className="pagination__component">
      <Button
        onClick={() => handlePageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
      >
        Previous
      </Button>
      <span>
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
      <Button
        onClick={() => handlePageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.totalPages}
      >
        Next
      </Button>
  </div>
</>
  );
};

export default ReusableTable;
