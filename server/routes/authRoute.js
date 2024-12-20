const express = require('express');
const url = require('url');
const router = express.Router();
const auth = require('../controllers/auth');
const jwt = require('jsonwebtoken');
const config = require('../config/secret.json');
const { authenticationToken } = require('../utils/AuthUtils');

router.post('/register/registerUser', userRegister);
router.post('/login/loginUser', loginUser);

module.exports = router;

async function userRegister(req, res, next) {
  try {
    const { name, email, password } = req.body;

    console.log('User Registration Attempt:', { name, email });

    if (!name || !email || !password) {
      console.log('Validation failed: Missing required fields.', { name, email, password });
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    console.log('Checking if email is already registered:', email);
    const existingUser = await auth.findUserByEmail(email);
    if (existingUser) {
      console.log('Registration failed: Email already in use.', email);
      return res.status(409).json({
        success: false,
        message: 'Email is already registered. Please use a different email.',
      });
    }

    console.log('Registering user:', { name, email });
    const result = await auth.registerUser({ name, email, password });

    console.log('User registered successfully:', result);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: result,
    });
  } catch (error) {
    console.error('Error during user registration:', error.message);

    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again later.',
      error: error.message,
    });
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    if (!email || !password) {
      console.log('Missing email or password.');
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Call loginUsers function
    const result = await auth.loginUsers(req.body);

    // Check if login was successful
    if (!result.success) {
      console.log('Login failed:', result.message, { email });
      return res.status(401).json({ message: result.message });
    }

    console.log('User logged in successfully:', {
      userId: result.data._id,
      email: result.data.email,
    });

    // Return the response
    return res.json({
      data: result.data,
      token: result.token,
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    next(error);
  }
}
