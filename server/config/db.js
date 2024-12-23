const mongoose = require('mongoose')

const mongoURI = 'mongodb+srv://user000:USERDB@cluster0.ekfoe.mongodb.net/invoice?retryWrites=true&w=majority';

try {
    mongoose
        .connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
} catch (error) {
    console.log('error', error)
}