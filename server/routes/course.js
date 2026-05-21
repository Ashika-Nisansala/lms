import express from 'express';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructorId', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructorId', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get lessons for a course
router.get('/:id/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.id }).sort('orderIndex');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a lesson
router.post('/:id/lessons', async (req, res) => {
  try {
    const lesson = new Lesson({ ...req.body, courseId: req.params.id });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
