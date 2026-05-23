import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QUIZZES = {
  '1': {
    title: 'Python for Beginners — Quiz',
    questions: [
      { q: 'Which symbol is used to print in Python?', options: ['console.log()', 'print()', 'echo()', 'System.out.println()'], correct: 1, tag: 'Basics' },
      { q: 'What data type is the value True in Python?', options: ['String', 'Integer', 'Boolean', 'Float'], correct: 2, tag: 'Data Types' },
      { q: 'Which keyword is used to define a function in Python?', options: ['func', 'function', 'define', 'def'], correct: 3, tag: 'Functions' },
      { q: 'What does the range(5) function produce?', options: ['1,2,3,4,5', '0,1,2,3,4', '0,1,2,3,4,5', '1,2,3,4'], correct: 1, tag: 'Loops' },
      { q: 'Which of the following is a correct way to create a list in Python?', options: ['list = (1,2,3)', 'list = {1,2,3}', 'list = [1,2,3]', 'list = <1,2,3>'], correct: 2, tag: 'Data Types' },
    ]
  },
  '2': {
    title: 'ICT Fundamentals — Quiz',
    questions: [
      { q: 'What does ICT stand for?', options: ['Internet Computer Technology', 'Information and Communications Technology', 'Integrated Computer Technology', 'International Computer Tools'], correct: 1, tag: 'Basics' },
      { q: 'What is RAM used for?', options: ['Permanent storage', 'Processing graphics', 'Temporary memory', 'Network connection'], correct: 2, tag: 'Hardware' },
      { q: 'What does CPU stand for?', options: ['Computer Processing Unit', 'Central Power Unit', 'Central Processing Unit', 'Core Processing Unit'], correct: 2, tag: 'Hardware' },
    ]
  },
  '3': {
    title: 'Python OOP — Quiz',
    questions: [
      { q: 'Which keyword is used to create a class in Python?', options: ['class', 'def', 'init', 'object'], correct: 0, tag: 'Classes' },
      { q: 'What is the name of the special method used as a constructor in Python?', options: ['__init__', '__new__', 'constructor', 'init'], correct: 0, tag: 'Constructors' },
      { q: 'Which concept allows a class to inherit attributes and methods from another class?', options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'], correct: 0, tag: 'Inheritance' },
      { q: 'What does the "self" parameter refer to inside a class method?', options: ['The current instance of the class', 'The class itself', 'The parent class', 'A global variable'], correct: 0, tag: 'Self Reference' },
    ]
  },
  '4': {
    title: 'Data Structures with Python — Quiz',
    questions: [
      { q: 'Which Python data structure is mutable and defined with square brackets?', options: ['List', 'Tuple', 'Dictionary', 'Set'], correct: 0, tag: 'Lists' },
      { q: 'Which data structure uses key-value pairs?', options: ['Dictionary', 'List', 'Set', 'Tuple'], correct: 0, tag: 'Dictionaries' },
      { q: 'What type of data structure follows the Last-In, First-Out (LIFO) principle?', options: ['Stack', 'Queue', 'Linked List', 'Tree'], correct: 0, tag: 'Stacks' },
      { q: 'Which method is used to add an item to the end of a Python list?', options: ['append()', 'add()', 'insert()', 'push()'], correct: 0, tag: 'Lists' },
    ]
  },
  '5': {
    title: 'Database & SQL Basics — Quiz',
    questions: [
      { q: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Structured Question Language', 'System Query Logic'], correct: 0, tag: 'SQL Basics' },
      { q: 'Which SQL statement is used to retrieve data from a database?', options: ['SELECT', 'GET', 'RETRIEVE', 'FETCH'], correct: 0, tag: 'Retrieving Data' },
      { q: 'Which clause is used to filter records in a SELECT query?', options: ['WHERE', 'FILTER', 'HAVING', 'GROUP BY'], correct: 0, tag: 'Filtering Data' },
      { q: 'What does a PRIMARY KEY do in a database table?', options: ['Uniquely identifies each record', 'Speeds up text search only', 'Links two tables together', 'Allows duplicate values'], correct: 0, tag: 'Database Keys' },
    ]
  },
  '6': {
    title: 'Web Technologies — Quiz',
    questions: [
      { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperTransfer Markup Language', 'HyperText Model Links'], correct: 0, tag: 'HTML' },
      { q: 'Which technology is primarily used to style and lay out web pages?', options: ['CSS', 'HTML', 'JavaScript', 'PHP'], correct: 0, tag: 'CSS' },
      { q: 'Which keyword is used to declare a block-scoped variable in modern JavaScript?', options: ['let', 'var', 'constant', 'global'], correct: 0, tag: 'JavaScript' },
      { q: 'What is the default port number for HTTP communication?', options: ['80', '443', '8080', '3000'], correct: 0, tag: 'Networking' },
    ]
  }
};

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZZES[id] || QUIZZES['1'];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (optIndex) => {
    if (!submitted) setAnswers({ ...answers, [current]: optIndex });
  };

  const handleSubmit = () => setSubmitted(true);

  const score = submitted
    ? quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)
    : 0;

  const weakAreas = submitted
    ? [...new Set(quiz.questions.filter((q, i) => answers[i] !== q.correct).map(q => q.tag))]
    : [];

  if (submitted) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`p-8 rounded-2xl text-center ${pct >= 60 ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-rose-500'} text-white shadow-xl`}>
          <div className="text-6xl mb-4">{pct >= 60 ? '🏆' : '📚'}</div>
          <h1 className="text-3xl font-black mb-2">{pct}%</h1>
          <p className="text-xl font-semibold">{score} / {quiz.questions.length} Correct</p>
          <p className="mt-2 opacity-90">{pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort! Keep practicing.' : 'Keep studying and try again!'}</p>
        </div>

        {weakAreas.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-bold text-amber-800 mb-2">🔍 Weak Areas Detected</h3>
            <p className="text-amber-700 text-sm mb-3">Focus on these topics to improve your score:</p>
            <div className="flex flex-wrap gap-2">
              {weakAreas.map(area => (
                <span key={area} className="bg-amber-200 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">{area}</span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {quiz.questions.map((q, i) => (
            <div key={i} className={`p-4 rounded-xl border-2 ${answers[i] === q.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <p className="font-semibold text-slate-700 text-sm">{i + 1}. {q.q}</p>
              <p className="text-sm mt-1">
                {answers[i] === q.correct
                  ? <span className="text-green-600 font-medium">✓ {q.options[q.correct]}</span>
                  : <span className="text-red-600 font-medium">✗ You chose: {q.options[answers[i]] || 'No answer'} | Correct: {q.options[q.correct]}</span>}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setCurrent(0); setAnswers({}); setSubmitted(false); }}
            className="flex-1 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all">
            Retake Quiz
          </button>
          <button onClick={() => navigate('/student/courses')}
            className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const q = quiz.questions[current];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-slate-800">{quiz.title}</h1>
          <span className="text-sm text-slate-400 font-medium">{current + 1} / {quiz.questions.length}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
          <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }} />
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-6">{q.q}</h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(i)}
              className={`w-full text-left px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200
                ${answers[current] === i
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700'}`}>
              <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {current > 0 && (
          <button onClick={() => setCurrent(current - 1)}
            className="px-6 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all">
            ← Back
          </button>
        )}
        {current < quiz.questions.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)} disabled={answers[current] === undefined}
            className="ml-auto px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={Object.keys(answers).length < quiz.questions.length}
            className="ml-auto px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Submit Quiz ✓
          </button>
        )}
      </div>
    </div>
  );
}
