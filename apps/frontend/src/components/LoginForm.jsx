import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import '../App.css'

const LoginForm = ({handleSubmit, setEmail, setPassword, setRole, email, password, role, error}) => {

  return (
    <div className="login-form">
      <RoleSelector selectedRole={role} setRole={setRole} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="submit-button">
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      </form>
      {error && <div>{error.Error}</div>}
      </div>
  );
};

export default LoginForm;
