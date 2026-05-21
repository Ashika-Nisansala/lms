import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const COURSE_DATA = {
  '1': {
    title: 'Python for Beginners', emoji: '🐍', color: 'from-blue-500 to-cyan-500',
    description: 'Start your Python journey from scratch. Learn variables, loops, functions and more.',
    lessons: [
      { id: 'l1', title: 'What is Python?', content: 'Python is a high-level, interpreted programming language. It was created by Guido van Rossum and first released in 1991.\n\nPython emphasizes code readability and uses significant indentation.\n\n```python\nprint("Hello, World!")\n```\n\nThis simple line prints a message to the screen — your first Python program!', videoUrl: '', orderIndex: 1 },
      { id: 'l2', title: 'Variables & Data Types', content: 'Variables are containers for storing data values.\n\n```python\nname = "Alice"   # String\nage = 20          # Integer\ngpa = 3.75        # Float\nis_student = True # Boolean\nprint(name, age, gpa, is_student)\n```\n\nPython automatically detects the type of variable you create.', videoUrl: '', orderIndex: 2 },
      { id: 'l3', title: 'Loops in Python', content: 'Loops allow you to repeat code multiple times.\n\n**For loop:**\n```python\nfor i in range(5):\n    print(i)\n```\n\n**While loop:**\n```python\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n```', videoUrl: '', orderIndex: 3 },
      { id: 'l4', title: 'Functions', content: 'Functions are reusable blocks of code.\n\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("Alice")\nprint(result)  # Hello, Alice!\n```\n\nFunctions help you avoid repetition and keep your code organized.', videoUrl: '', orderIndex: 4 },
    ]
  },
  '2': {
    title: 'ICT Fundamentals', emoji: '💻', color: 'from-purple-500 to-pink-500',
    description: 'Understand computers, networks, the internet and digital literacy concepts.',
    lessons: [
      { id: 'l1', title: 'What is ICT?', content: 'Information and Communications Technology (ICT) refers to all technology used to handle telecommunications, broadcast media, intelligent building management systems, audiovisual processing and transmission systems, and network-based control.', videoUrl: '', orderIndex: 1 },
      { id: 'l2', title: 'Computer Hardware', content: 'Hardware refers to the physical components of a computer system:\n\n- **CPU** – Central Processing Unit (the brain)\n- **RAM** – Random Access Memory (temporary storage)\n- **HDD/SSD** – Hard Drive (permanent storage)\n- **GPU** – Graphics Processing Unit', videoUrl: '', orderIndex: 2 },
    ]
  },
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(0);
  const [completed, setCompleted] = useState([]);

  const course = COURSE_DATA[id] || COURSE_DATA['1'];
  const lesson = course.lessons[activeLesson];

  const markComplete = () => {
    if (!completed.includes(activeLesson)) setCompleted([...completed, activeLesson]);
    if (activeLesson < course.lessons.length - 1) setActiveLesson(activeLesson + 1);
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar */}
      <aside className="w-72 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col flex-shrink-0">
        <div className={`h-24 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center mb-4`}>
          <span className="text-5xl">{course.emoji}</span>
        </div>
        <h2 className="font-bold text-slate-800 mb-1">{course.title}</h2>
        <p className="text-xs text-slate-400 mb-4">{course.lessons.length} Lessons</p>
        <div className="space-y-2 flex-1">
          {course.lessons.map((l, i) => (
            <button key={l.id} onClick={() => setActiveLesson(i)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${activeLesson === i ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>{completed.includes(i) ? '✅' : `${i + 1}.`}</span>
              <span className="truncate">{l.title}</span>
            </button>
          ))}
        </div>
        <button onClick={() => navigate(`/student/quiz/${id}`)}
          className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-all text-sm">
          📝 Take Quiz
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{lesson.title}</h1>
        <div className="text-slate-400 text-sm mb-6">Lesson {activeLesson + 1} of {course.lessons.length}</div>
        <div className="prose prose-slate max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-base">{lesson.content}</pre>
        </div>
        <div className="mt-8 flex gap-4">
          {activeLesson > 0 && (
            <button onClick={() => setActiveLesson(activeLesson - 1)}
              className="px-6 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-all">
              ← Previous
            </button>
          )}
          <button onClick={markComplete}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all">
            {completed.includes(activeLesson) ? 'Next Lesson →' : '✓ Mark as Complete'}
          </button>
        </div>
      </main>
    </div>
  );
}
