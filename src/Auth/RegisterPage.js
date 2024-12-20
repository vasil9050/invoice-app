import React, { useState } from 'react';
import { registerUser } from '../utils/auth-utils';
// import { isUserAuthenticated } from '../utils/auth-utils';
import { useNavigate } from 'react-router-dom';
import './authentication.css';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isUserAuthenticated) {
  //     navigate('/');
  //   } else {
  //     navigate('/register');
  //   }
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Register Data Submitted:', formData);
    try {
      const data = await registerUser(formData);
      setMessage(data.message || 'Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setMessage(error.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className='card p-4 shadow-lg' style={{ width: '400px', borderRadius: '25px' }}>
        <h3 className='text-center'>Register</h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>
              Name
            </label>
            <input
              type='text'
              className='form-control'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
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
            Register
          </button>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'grey',
              cursor: 'pointer',
              textAlign: 'center',
              marginTop: '10px',
            }}
            onClick={() => navigate('/login')}
          >
            Login if already a user
          </p>
        </form>
        {message && <p className='mt-3 text-success text-center'>{message}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;
