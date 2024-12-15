import React, { useState } from 'react';
import { Modal, TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAppointment, editAppointment } from '../api/auth';


const AppointmentModal = ({
  isOpen,
  onClose,
  initialData,
  appointments,
  setAppointments,
  loggedInUser,
  doctors
}) => {

    console.log(initialData, 'initialData')
    
    const modalStyles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '400px',
      };
      
      const formGroupStyles = {
        marginBottom: '15px',
      };
      
      const modalActionsStyles = {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem'
      };
      
      const buttonStyles = {
        padding: '10px 20px',
        fontSize: '14px',
      };
  const [formData, setFormData] = useState({
    id: initialData?.id,
    doctorId: 2,
    patientName: initialData?.patientName || '',
    date: initialData?.date || null,
    time: initialData?.time || '',
    appointmentType: initialData?.appointmentType || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState({
    patientName: '',
    date: '',
    time: '',
    appointmentType: '',
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (loggedInUser.role === 'admin' && !formData.doctorId) {
        newErrors.doctorId = 'Doctor name is required';
        isValid = false;
      }

    if (!formData.patientName) {
      newErrors.patientName = 'Patient name is required';
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
      isValid = false;
    }

    if (!formData.appointmentType) {
      newErrors.appointmentType = 'Appointment type is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
        const appointment = initialData ? await editAppointment(formData.id, formData) : await createAppointment(formData)
        console.log(formData, 'formData')
        console.log('Submitted Appointment:', appointment);
        if(appointment){
            setAppointments((prev) =>
                initialData
                  ? prev.map((a) => (a.id === appointment.id ? appointment : a))
                  : [...prev, appointment]
              );
        }

      toast.success('Appointment saved successfully!');
      onClose();
    } else {
      toast.error('Please fix the errors before submitting');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={modalStyles}>
        <h2>{initialData ? 'Edit Appointment' : 'Create Appointment'}</h2>
        <form>
            {loggedInUser.role === 'admin' && !initialData && <div style={formGroupStyles}>
            <FormControl fullWidth error={!!errors.appointmentType}>
              <InputLabel>Doctor Name</InputLabel>
              <Select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                label="Doctor Name"
              >
                {doctors?.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>{doctor.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.doctorName}</FormHelperText>
            </FormControl>
            </div>}
          <div style={formGroupStyles}>
          
            <TextField
              label="Patient Name"
              variant="outlined"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.patientName}
              helperText={errors.patientName}
            />
          </div>

          <div style={formGroupStyles}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} error={!!errors.date} helperText={errors.date} fullWidth />}
            />
            </LocalizationProvider>
          </div>

          <div style={formGroupStyles}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TextField
              label="Time"
              variant="outlined"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.time}
              helperText={errors.time}
            />
            </LocalizationProvider>
          </div>

          <div style={formGroupStyles}>
            <FormControl fullWidth error={!!errors.appointmentType}>
              <InputLabel>Appointment Type</InputLabel>
              <Select
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleInputChange}
                label="Appointment Type"
              >
                <MenuItem value="In-Person">In-Person</MenuItem>
                <MenuItem value="Virtual">Virtual</MenuItem>
              </Select>
              <FormHelperText>{errors.appointmentType}</FormHelperText>
            </FormControl>
          </div>

          <div style={formGroupStyles}>
            <TextField
              label="Notes"
              variant="outlined"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              error={!!errors.notes}
              helperText={errors.notes}
            />
          </div>

          <div style={modalActionsStyles}>
            <Button onClick={onClose} variant="contained" color="secondary" style={buttonStyles}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" style={buttonStyles}>
              Save
            </Button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </Modal>
  );
};

export default AppointmentModal;
