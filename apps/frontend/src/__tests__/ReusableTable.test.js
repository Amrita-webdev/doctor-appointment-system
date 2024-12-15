import React from 'react';
import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/react';
import ReusableTable from '../components/ReusableTable';
import { Button } from '../utils/components';

jest.mock('../utils/components', () => ({
  Button: ({ handleSubmit, children }) => (
    <button onClick={handleSubmit}>{children}</button>
  )
}));

jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn()
  }));

describe('ReusableTable Component', () => {
  const doctors = [{ id: 1, name: 'Dr. John Doe' }];
  const appointments = [
    {
      id: 1,
      doctorId: 1,
      doctorName: "Dr. Smith",
      patientName: 'Jane Doe',
      date: '2024-12-18T18:30:00.000Z',
      time: '18:30',
      appointmentType: 'virtual'
    }
  ];
  const loggedInUser = { id: 1, role: 'admin' };
  const pagination = { currentPage: 1, totalPages: 2 };
  const setAppointments = jest.fn();
  const handlePageChange = jest.fn();

  beforeEach(() => {
    render(
      <ReusableTable
        doctors={doctors}
        appointments={appointments}
        loggedInUser={loggedInUser}
        handlePageChange={handlePageChange}
        pagination={pagination}
        setAppointments={setAppointments}
      />
    );
  });

  it('should render the table correctly', () => {
    expect(screen.getByText('Patient Name')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Appointment Type')).toBeInTheDocument();
  });

  it('should open View Appointment modal when "View" button is clicked', () => {
    fireEvent.click(screen.getByText('View'));

    expect(screen.getByText('View Appointment')).toBeInTheDocument();
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
  });

  it('should open Edit Appointment modal when "Edit" button is clicked', () => {
    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByText('Edit Appointment')).toBeInTheDocument();
  });

  it('should delete an appointment when "Delete" button is clicked', () => {
    fireEvent.click(screen.getByText('Delete'));

    expect(setAppointments).toHaveBeenCalledWith([]);
  });

  it('should display doctor name correctly when logged in user is admin', () => {
    const doctorName = screen.getByText('Dr. John Doe');
    expect(doctorName).toBeInTheDocument();
  });

});
