const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
        
        // Create a simple schema
        const TestSchema = new mongoose.Schema({
            name: String
        });
        
        // Create a model
        const Test = mongoose.model('Test', TestSchema);
        
        // Try to create a document
        const test = new Test({ name: 'test' });
        await test.save();
        console.log('Test document created successfully');
        
        // Close the connection
        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB(); 