import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/lms');
    console.log('Connected to DB successfully!');
    
    const name = 'Test User';
    const email = 'test_register@example.com';
    const password = 'Password123';
    const role = 'student';
    
    const existingUser = await User.findOne({ email });
    console.log('Existing user check returned:', existingUser);
    if (existingUser) {
      await User.deleteOne({ email });
      console.log('Deleted existing test user');
    }

    console.log('Hashing password with bcrypt...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password successfully:', hashedPassword);
    
    const user = new User({ name, email, password: hashedPassword, role });
    console.log('Saving user to DB...');
    await user.save();
    console.log('User saved successfully!');
  } catch (error) {
    console.error('Error occurred in registration flow:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB.');
  }
}
run();
