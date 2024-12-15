import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import ReusableTable from "../components/ReusableTable";
import { createAppointment, fetchAppointments, fetchDoctors } from "../api/auth";
import { Button } from "../utils/components";
import AppointmentModal from "../components/AppointmentModal";

const DoctorDashboard = () => {
  const location = useLocation();
  const user = location.state?.user;

  const [appointments, setAppointments] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([])
  

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const fetchallAppointments = async () => {
    setLoading(true);
    try {
        const response = await fetchAppointments(pagination.currentPage, 10)
        const doctorResponse = await fetchDoctors()
        setAppointments(response.data);
        setPagination(response.pagination);
        setDoctors(doctorResponse.data)
    } catch (err) {
        setError('Failed to fetch appointments');
    } finally {
        setLoading(false)
    }
  };

  useEffect(() => {
    fetchallAppointments(pagination.currentPage, 10);
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  console.log(appointments)

  return (
    <div>
        <Header user={user}/>
        <div className="admin__container">
            <div className="title__container">
                <div>
                    <h2>Welcome, Admin</h2>
                </div>
                <Button backgroundColor={'#2e7d32'} color={'white'} handleSubmit={() => setIsModalOpen(true)}>Create Appointment</Button>
                { isModalOpen && <AppointmentModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    appointments={appointments}
                    setAppointments={setAppointments}
                    loggedInUser={location.state}
                    doctors={doctors}
                />}
            </div>
            <ReusableTable appointments={appointments} loggedInUser={location.state} handlePageChange={handlePageChange} pagination={pagination} setAppointments={setAppointments} doctors={doctors}/>
        </div>
    </div>
  );
};

export default DoctorDashboard;
