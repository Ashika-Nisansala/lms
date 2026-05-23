import mongoose from 'mongoose';
import User from './models/User.js';

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/lms');
    console.log('Connected to DB!');
    
    const users = await User.find({});
    console.log(`Found ${users.length} users in the database:`);
    users.forEach(user => {
      console.log(`- ID: ${user._id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}
run();
