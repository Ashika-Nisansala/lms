import express from 'express';
import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';

const router = express.Router();

// Get quizzes for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a quiz
router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz answers and auto-grade
router.post('/:id/submit', async (req, res) => {
  try {
    const { studentId, answers } = req.body; 
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    const weakAreas = [];

    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctOptionIndex) {
        score++;
      } else if (q.conceptTag) {
        if (!weakAreas.includes(q.conceptTag)) weakAreas.push(q.conceptTag);
      }
    });

    const result = new Result({
      studentId,
      quizId: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      weakAreas,
    });
    await result.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get results for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId }).populate('quizId', 'title');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
