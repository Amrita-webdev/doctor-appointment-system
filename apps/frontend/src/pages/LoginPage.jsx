import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import LoginForm from '../components/LoginForm';
import '../App.css'
import { Loader } from '../utils/components';
import { loginUser } from '../api/auth';

const LoginPage = ({setIsAuthenticated}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true)
      const response = await loginUser({ email, password, role });
      localStorage.setItem('token', response.token);
      console.log(response)
      setIsAuthenticated(true)
      setRole(response.role)
      if (response.role === "admin") {
        navigate("/admin", { state: { user: email, role: response.role, id: response.id } });
      } else if (response.role === "doctor") {
        navigate("/doctor", { state: { user: email, role: response.role, id: response.id } });
      }
    } catch (error) {
      console.log(error)
      setError(error.Error)
    } finally{
      setLoading(false)
    }
  };
  return (
    <div>
      {loading ? <Loader /> : 
      <div className='loginPage'>
      <div className='loginContainer'>
        <h3>AI powered medical scribe & coding engine to regain your time and increase revenue.</h3>
      </div>
      <LoginForm handleSubmit={handleSubmit} setEmail={setEmail} setPassword={setPassword} setRole={setRole} error={error} email={email} password={password} role={role}/>
    </div>
      }
      </div>
  );
};

export default LoginPage;
