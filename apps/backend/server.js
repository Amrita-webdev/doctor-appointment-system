const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Dr. Smith', email: 'smith@example.com', password: 'doctor123', role: 'doctor' },
  { id: 3, name: 'Dr. Chakraborty', email: 'chakraborty@example.com', password: 'doctor123', role: 'doctor' },
  { id: 4, name: 'Dr. Riya', email: 'riya@example.com', password: 'doctor123', role: 'doctor' }
];

const doctors = [
  { id: 2, name: 'Dr. Smith', email: 'smith@example.com', password: 'doctor123', role: 'doctor' },
  { id: 3, name: 'Dr. Chakraborty', email: 'chakraborty@example.com', password: 'doctor123', role: 'doctor' },
  { id: 4, name: 'Dr. Riya', email: 'riya@example.com', password: 'doctor123', role: 'doctor' }
]

const appointments = [
  { id: 1, doctorId: 2, doctorName: 'Dr. Smith', patientName: 'John Doe', date: '2024-12-12', time: '10:00 AM', appointmentType: 'virtual', notes: 'Initial consultation' },
  { id: 2, doctorId: 2, doctorName: 'Dr. Smith', patientName: 'Amrita Mazumder', date: '2024-12-14', time: '11:00 AM', appointmentType: 'virtual', notes: 'Initial consultation' },
  { id: 3, doctorId: 3, doctorName: 'Dr. Chakraborty', patientName: 'Ashish Singh', date: '2024-12-14', time: '2:00 PM', appointmentType: 'virtual', notes: 'Initial consultation' },
  { id: 4, doctorId: 4, doctorName: 'Dr. Riya', patientName: 'Dia Mirza', date: '2024-12-13', time: '12:00 AM', appointmentType: 'virtual', notes: 'Initial consultation' },
  { id: 5, doctorId: 4, doctorName: 'Dr. Riya', patientName: 'Kareen Kapoor', date: '2024-12-15', time: '9:00 AM', appointmentType: 'virtual', notes: 'Initial consultation' },
];

const SECRET_KEY = process.env.SECRET_KEY
console.log(SECRET_KEY)

// Middleware to authenticate and authorize users
function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

// Role-based access control middleware
function authorize(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

// Authentication route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, role: user.role, id: user.id });
});

// Blacklist storage (in-memory for now)
let tokenBlacklist = [];

// Logout API
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(400).json({ message: 'Token required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Add the token to the blacklist
    tokenBlacklist.push(token);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

// Middleware to check if the token is blacklisted
function checkBlacklist(req, res, next) {
  const token = req.headers['authorization'];
  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: 'Token is blacklisted. Please login again.' });
  }
  next();
}

// Apply checkBlacklist middleware before routes requiring authentication
app.use('/api/appointments', authenticate, checkBlacklist);


// List appointments (paginated)
app.get('/api/appointments', authenticate, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);

  let result = appointments;
  if (req.user.role === 'doctor') {
    result = result.filter(a => a.doctorId === req.user.id);
  }

  res.json({
    data: result.slice(start, end),
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.length / limit),
      totalItems: result.length
    }
  });
});

app.get('/api/doctors', authenticate, (req, res) => {
  let result = doctors;
  res.json({
    data: result
  });
});

// Get appointments for a specific doctor
app.get('/api/appointments/doctor/:doctorId', authenticate, authorize(['admin', 'doctor']), (req, res) => {
  const { doctorId } = req.params;

  // Validate if the doctorId matches for doctor role
  if (req.user.role === 'doctor' && req.user.id !== parseInt(doctorId)) {
    return res.status(403).json({ message: 'Doctors can only view their own appointments.' });
  }

  const doctorAppointments = appointments.filter(a => a.doctorId === parseInt(doctorId));
  res.json({ data: doctorAppointments });
});

// Create appointment
app.post('/api/appointments', authenticate, authorize(['admin', 'doctor']), (req, res) => {
  const { patientName, doctorId, date, time, appointmentType, notes } = req.body;

  if (req.user.role === 'doctor' && req.user.id !== doctorId) {
    return res.status(403).json({ message: 'Doctors can only create appointments for themselves.' });
  }

  const newAppointment = {
    id: appointments.length + 1,
    doctorId: req.user.role === 'doctor' ? req.user.id : doctorId,
    date,
    time,
    appointmentType,
    patientName,
    notes
  };

  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

// Edit appointment
app.put('/api/appointments/:id', authenticate, authorize(['admin', 'doctor']), (req, res) => {
  const { id } = req.params;
  const { date, time, appointmentType, notes } = req.body;

  const appointment = appointments.find(a => a.id == id);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  if (req.user.role === 'doctor' && appointment.doctorId !== req.user.id) {
    return res.status(403).json({ message: 'Doctors can only edit their own appointments.' });
  }

  appointment.date = date || appointment.date;
  appointment.time = time || appointment.time;
  appointment.appointmentType = appointmentType || appointment.appointmentType;
  appointment.notes = notes || appointment.notes;

  res.json({ message: 'Appointment updated successfully', appointment });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


