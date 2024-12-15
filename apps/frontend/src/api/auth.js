import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');

const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw new Error('Network error');
    }
  }
};
const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`, 
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Logout failed');
    } else {
      throw new Error('Network error');
    }
  }
};

const fetchAppointments = async (page, limit) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
      params: { page, limit },
      headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
const fetchDoctors = async() => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctors`, {
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return response.data
} catch (error) {
  throw new Error(error.response.data.message);
}
}
const createAppointment = async ({ patientName, doctorId, date, time, appointmentType, notes }) => {
  try{
    const response = await axios.post(`${API_BASE_URL}/appointments`, {
      patientName,
      doctorId, 
      date, 
      time, 
      appointmentType, 
      notes
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    return response.data
  } catch (error){
    throw new Error(error.response.data.message);
  }
}

const editAppointment = async (appointmentId, updatedData) => {
  try{
    const response = await axios.put(`${API_BASE_URL}/appointments/${appointmentId}`, updatedData, 
      {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }
  )
    return response.data.appointment
  } catch(error){
    throw new Error(error.response.data.message)
  }
}

export {loginUser, logoutUser, fetchAppointments, fetchDoctors, createAppointment, editAppointment}
