import React, { useState } from 'react';
import { loginUser } from '../utils/auth-utils';
import { useNavigate } from 'react-router-dom';
import './authentication.css';
// import { isUserAuthenticated } from '../utils/auth-utils';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isUserAuthenticated) {
  //     navigate('/');
  //   } else {
  //     navigate('/login');
  //   }
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login Data Submitted:', formData);
    try {
      const data = await loginUser(formData);
      localStorage.setItem('authToken', data.token);
      setMessage('Login successful!');
      navigate('/');
    } catch (error) {
      setMessage(error.message || 'Login failed.');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className='card p-4 shadow-lg' style={{ width: '400px', borderRadius: '25px' }}>
        <h3 className='text-center'>Login</h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email address
            </label>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type='submit' className='btn btn-outline-primary w-100'>
            Login
          </button>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'grey',
              cursor: 'pointer',
              textAlign: 'center',
              marginTop: '10px',
            }}
            onClick={() => navigate('/register')}
          >
            Register if not a user
          </p>
        </form>
        {message && <p className='mt-3 text-success text-center'>{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
