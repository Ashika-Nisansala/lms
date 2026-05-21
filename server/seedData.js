import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Find admin to use as instructor
  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    const hash = await bcrypt.hash('Admin@1234', 10);
    admin = await User.create({ name: 'Admin', email: 'admin@lms.edu', password: hash, role: 'admin' });
    console.log('✅ Created admin user');
  }

  // Seed Courses
  const existingCourse = await Course.findOne({ title: 'Python for Beginners' });
  if (existingCourse) {
    console.log('⚠️  Sample data already seeded. Skipping.');
    process.exit(0);
  }

  const course1 = await Course.create({
    title: 'Python for Beginners',
    description: 'Start your Python journey from scratch. Learn variables, loops, functions and more.',
    category: 'Python',
    instructorId: admin._id,
    thumbnailUrl: '',
  });

  const course2 = await Course.create({
    title: 'ICT Fundamentals',
    description: 'Understand computers, networks, the internet and digital literacy concepts.',
    category: 'ICT',
    instructorId: admin._id,
    thumbnailUrl: '',
  });

  // Seed Lessons for Course 1
  await Lesson.insertMany([
    { courseId: course1._id, title: 'What is Python?', content: 'Python is a high-level, interpreted programming language created by Guido van Rossum.\n\nExample:\n  print("Hello, World!")', orderIndex: 1 },
    { courseId: course1._id, title: 'Variables & Data Types', content: 'Variables store data values.\n\n  name = "Alice"\n  age = 20\n  gpa = 3.75\n  is_student = True', orderIndex: 2 },
    { courseId: course1._id, title: 'Loops in Python', content: 'Loops repeat code.\n\n  for i in range(5):\n      print(i)\n\n  count = 0\n  while count < 5:\n      count += 1', orderIndex: 3 },
    { courseId: course1._id, title: 'Functions', content: 'Functions are reusable blocks of code.\n\n  def greet(name):\n      return f"Hello, {name}!"\n\n  print(greet("Alice"))', orderIndex: 4 },
  ]);

  await Lesson.insertMany([
    { courseId: course2._id, title: 'What is ICT?', content: 'ICT stands for Information and Communications Technology. It includes all technologies used to handle digital information.', orderIndex: 1 },
    { courseId: course2._id, title: 'Computer Hardware', content: 'Hardware = physical parts of a computer.\n- CPU: processes instructions\n- RAM: temporary memory\n- HDD/SSD: permanent storage\n- GPU: handles graphics', orderIndex: 2 },
  ]);

  // Seed Quizzes
  await Quiz.create({
    courseId: course1._id,
    title: 'Python for Beginners — Quiz',
    questions: [
      { questionText: 'Which function is used to print in Python?', options: ['console.log()', 'print()', 'echo()', 'System.out.println()'], correctOptionIndex: 1, conceptTag: 'Basics' },
      { questionText: 'What is the data type of True in Python?', options: ['String', 'Integer', 'Boolean', 'Float'], correctOptionIndex: 2, conceptTag: 'Data Types' },
      { questionText: 'Which keyword defines a function?', options: ['func', 'function', 'define', 'def'], correctOptionIndex: 3, conceptTag: 'Functions' },
      { questionText: 'What does range(5) produce?', options: ['1,2,3,4,5', '0,1,2,3,4', '0,1,2,3,4,5', '1,2,3,4'], correctOptionIndex: 1, conceptTag: 'Loops' },
    ],
  });

  await Quiz.create({
    courseId: course2._id,
    title: 'ICT Fundamentals — Quiz',
    questions: [
      { questionText: 'What does ICT stand for?', options: ['Internet Computer Technology', 'Information and Communications Technology', 'Integrated Computer Technology', 'International Computer Tools'], correctOptionIndex: 1, conceptTag: 'Basics' },
      { questionText: 'What is RAM used for?', options: ['Permanent storage', 'Processing graphics', 'Temporary memory', 'Network connection'], correctOptionIndex: 2, conceptTag: 'Hardware' },
    ],
  });

  console.log('');
  console.log('🎉 Sample data seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Courses : Python for Beginners, ICT Fundamentals');
  console.log('  Lessons : 4 (Python), 2 (ICT)');
  console.log('  Quizzes : 1 per course');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
}

seed().catch(err => { console.error('❌', err.message); process.exit(1); });
