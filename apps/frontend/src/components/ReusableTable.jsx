import React, { useState } from 'react';
import AppointmentModal from './AppointmentModal';
import { Button } from '../utils/components';
import '../App.css';
import ViewAppointmentModal from './ViewModal';

const ReusableTable = ({ doctors, appointments, loggedInUser, handlePageChange, pagination, setAppointments }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const filteredAppointments = loggedInUser.role === 'admin'
    ? appointments
    : appointments.filter((appointment) => appointment.doctorId === loggedInUser.id);

  const getDoctorName = (id) => {
    const doctor = doctors.find((doctor) => doctor.id === id);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEditOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditOpen(true);
  };

  const handleViewOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewOpen(true);
  };

  const handleViewClose = () => {
    setIsViewOpen(false);
    setSelectedAppointment(null);
  };

  const handleModalClose = () => {
    setIsEditOpen(false);
    setSelectedAppointment(null);
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  // Search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const searchedAppointments = filteredAppointments.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(searchTerm)
  );

  // Sort functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAppointments = [...searchedAppointments].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <>
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by Patient Name"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            {loggedInUser.role === 'admin' && (
              <th className="table-header" onClick={() => handleSort('doctorId')}>
                Doctor Name {sortConfig.key === 'doctorId' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▲'}
              </th>
            )}
            <th className="table-header" onClick={() => handleSort('patientName')}>
              Patient Name {sortConfig.key === 'patientName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▲'}
            </th>
            <th className="table-header" onClick={() => handleSort('date')}>
              Date {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▲'}
            </th>
            <th className="table-header" onClick={() => handleSort('time')}>
              Time {sortConfig.key === 'time' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▲'}
            </th>
            <th className="table-header" onClick={() => handleSort('appointmentType')}>
              Appointment Type {sortConfig.key === 'appointmentType' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▲'}
            </th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedAppointments.map((appointment) => (
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
                  <Button color={'#0288d1'} handleSubmit={() => handleViewOpen(appointment)}>View</Button>
                  <Button color={'#43a047'} handleSubmit={() => handleEditOpen(appointment)}>Edit</Button>
                  <Button color={'#bf360c'} handleSubmit={() => handleDelete(appointment.id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isViewOpen && (
        <ViewAppointmentModal
          isOpen={isViewOpen}
          onClose={handleViewClose}
          appointment={selectedAppointment}
        />
      )}
      {isEditOpen && (
        <AppointmentModal
          isOpen={isEditOpen}
          initialData={selectedAppointment}
          onClose={handleModalClose}
          appointments={appointments}
          setAppointments={setAppointments}
          loggedInUser={loggedInUser}
        />
      )}
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
