import React from 'react';

const RoleSelector = ({ selectedRole, setRole }) => {
  return (
    <div className="role-selector">
      <button
        className={`role-button ${selectedRole === 'admin' ? 'active' : ''}`}
        onClick={() => setRole('admin')}
      >
        Admin
      </button>
      <button
        className={`role-button ${selectedRole === 'doctor' ? 'active' : ''}`}
        onClick={() => setRole('doctor')}
      >
        Doctor
      </button>
    </div>
  );
};

export default RoleSelector;
