import React from "react";
import { useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div>
      <h2>Welcome to the Admin Dashboard</h2>
      <p>Logged in as: {user}</p>
    </div>
  );
};

export default AdminDashboard;
