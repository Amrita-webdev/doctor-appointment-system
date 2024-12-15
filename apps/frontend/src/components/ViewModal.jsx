import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const ViewAppointmentModal = ({ isOpen, onClose, appointment }) => {
  if (!appointment) return null;

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="view-appointment-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
        style={{backgroundColor: '#f5f5f5'}}
      >
        <Typography id="view-appointment-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          View Appointment
        </Typography>
        {/* Patient Info Card */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Patient Name:
            </Typography>
            <Typography variant="body1">{appointment.patientName}</Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
              Date:
            </Typography>
            <Typography variant="body1">{appointment.date}</Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
              Time:
            </Typography>
            <Typography variant="body1">{appointment.time}</Typography>
          </CardContent>
        </Card>

        {/* Doctor Info Card */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Doctor Name:
            </Typography>
            <Typography variant="body1">{appointment.doctorName}</Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
              Notes:
            </Typography>
            <Typography variant="body1">{appointment.notes || "No notes provided."}</Typography>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ViewAppointmentModal;
