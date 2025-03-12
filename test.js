require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        process.exit(0);
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }); 