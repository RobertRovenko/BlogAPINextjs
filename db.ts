// db.ts

import mongoose, { ConnectOptions } from 'mongoose';

const connectToDatabase = async () => {
  try {
    const uri = "mongodb+srv://blogappDB:blogappDBpassword@cluster0.qnfubge.mongodb.net/?retryWrites=true&w=majority";
    await mongoose.connect(uri, {
     
    } as ConnectOptions);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the application if unable to connect to MongoDB
  }
};

export default connectToDatabase;
