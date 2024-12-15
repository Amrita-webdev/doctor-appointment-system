import React from "react";
import { useLocation } from "react-router-dom";

const DoctorDashboard = () => {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div>
      <h2>Welcome to the Doctor Dashboard</h2>
      <p>Logged in as: {user}</p>
    </div>
  );
};

export default DoctorDashboard;
