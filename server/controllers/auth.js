const mongoose = require('mongoose');
const Register = require('../models/Register');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/secret.json')

class AuthController {

    async registerUser({ name, email, password }) {
        try {
            const existingUser = await Register.findOne({ email: email });
            if (existingUser) {
                console.log('User Already Exists');
                return { success: false, message: 'User with this email already exists.' };
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new Register({
                name: name,
                email: email,
                password: hashedPassword,
            });

            const savedUser = await newUser.save();
            console.log('USER SAVED', savedUser);

            const { password: _, ...userWithoutPassword } = savedUser.toObject();
            return { success: true, data: userWithoutPassword };
        } catch (error) {
            console.error('Error in registerUser:', error.message);
            throw new Error('Failed to register user.');
        }
    }

    async findUserByEmail(email) {
        let data = Register.findOne({ email: email });
        return data;
    }
    async loginUsers({ email, password }) {
        const user = await Register.findOne({ email: email });

        if (!user) {
            console.log('Login failed: User not found.', email);
            return { success: false, message: 'Invalid email or password.' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Login failed: Incorrect password.', email);
            return { success: false, message: 'Invalid email or password.' };
        }

        const token = jwt.sign(
            {
                User_Id: user._id,
                UserEmail: user.email,
            },
            config.secret,
            { expiresIn: '2 days' }
        );

        console.log('User logged in successfully:', { userId: user._id, email: user.email });

        const { password: _, ...userWithoutPassword } = user.toObject();
        return { success: true, data: userWithoutPassword, token };
    }
}


const controller = new AuthController();
module.exports = controller;