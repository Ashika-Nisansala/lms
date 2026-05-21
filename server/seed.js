import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms';

const adminData = {
  name: 'Admin',
  email: 'admin@lms.edu',
  password: 'Admin@1234',
  role: 'admin',
};

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log('⚠️  Admin account already exists:', adminData.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();

    console.log('');
    console.log('🎉 Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email    :', adminData.email);
    console.log('  Password :', adminData.password);
    console.log('  Role     : admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
