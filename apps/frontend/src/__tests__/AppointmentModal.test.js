import React from 'react';
import '@testing-library/jest-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AppointmentModal from '../components/AppointmentModal';
import { ToastContainer } from 'react-toastify';

jest.mock('../api/auth', () => ({
  createAppointment: jest.fn(),
  editAppointment: jest.fn(),
}));

const mockCreateAppointment = require('../api/auth').createAppointment;
const mockEditAppointment = require('../api/auth').editAppointment;

describe('AppointmentModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    initialData: null,
    appointments: [],
    setAppointments: jest.fn(),
    loggedInUser: { role: 'user' },
    doctors: [
      { id: 1, name: 'Dr. Smith' },
      { id: 2, name: 'Dr. Jane' },
    ],
  };

  const renderComponent = (props = {}) => {
    render(
      <>
        <AppointmentModal {...defaultProps} {...props} />
        <ToastContainer />
      </>
    );
  };

  it('renders the modal with default fields', () => {
    renderComponent();
    expect(screen.getByText('Create Appointment')).toBeInTheDocument();
    expect(screen.getByLabelText('Patient Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Appointment Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('calls editAppointment API when editing an existing appointment', async () => {
    mockEditAppointment.mockResolvedValue({ id: 1, patientName: 'John Doe Updated' });

    renderComponent({
      initialData: {
        id: 1,
        doctorId: 2,
        patientName: 'John Doe',
        date: '2024-12-15',
        time: '10:00 AM',
        appointmentType: 'In-Person',
        notes: 'Follow-up checkup',
      },
    });

    fireEvent.change(screen.getByLabelText('Patient Name'), { target: { value: 'John Doe Updated' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockEditAppointment).toHaveBeenCalledWith(1, {
        id: 1,
        doctorId: 2,
        patientName: 'John Doe Updated',
        date: '2024-12-15',
        time: '10:00 AM',
        appointmentType: 'In-Person',
        notes: 'Follow-up checkup',
      });
      expect(defaultProps.setAppointments).toHaveBeenCalled();
    });
  });

  it('does not call API if validation fails', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockCreateAppointment).not.toHaveBeenCalled();
      expect(mockEditAppointment).not.toHaveBeenCalled();
    });
  });

  it('closes the modal on cancel', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Cancel'));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
