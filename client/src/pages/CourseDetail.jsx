import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  '3': {
    title: 'Python OOP', emoji: '🔧', color: 'from-green-500 to-teal-500',
    description: 'Master Object Oriented Programming in Python: classes, inheritance, polymorphism.',
    lessons: [
      { id: 'l1', title: 'Introduction to OOP', content: 'Object-Oriented Programming (OOP) is a programming paradigm that uses "objects" to represent data and methods. It helps structure software into reusable blueprints (classes) to make it more organized and maintainable.', videoUrl: '', orderIndex: 1 },
      { id: 'l2', title: 'Classes and Objects', content: 'A Class is a blueprint or template, while an Object is an instance of that class.\n\n```python\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n\nmy_dog = Dog("Buddy")\nprint(my_dog.name)  # Buddy\n```', videoUrl: '', orderIndex: 2 },
      { id: 'l3', title: 'Inheritance & Polymorphism', content: 'Inheritance allows a child class to inherit attributes and methods from a parent class. Polymorphism allows different classes to have methods with the same name but different behaviors.\n\n```python\nclass Animal:\n    def speak(self):\n        return "Sound"\n\nclass Cat(Animal):\n    def speak(self):\n        return "Meow"\n\nmy_cat = Cat()\nprint(my_cat.speak())  # Meow\n```', videoUrl: '', orderIndex: 3 },
    ]
  },
  '4': {
    title: 'Data Structures with Python', emoji: '📊', color: 'from-orange-500 to-red-500',
    description: 'Lists, tuples, dictionaries, sets, stacks and queues explained with Python.',
    lessons: [
      { id: 'l1', title: 'Lists & Tuples', content: 'Lists are ordered, mutable collections of items. Tuples are ordered, immutable collections.\n\n```python\nmy_list = [1, 2, 3]\nmy_list.append(4)  # Allowed\n\nmy_tuple = (1, 2, 3)\n# my_tuple[0] = 5  # TypeError (immutable)\n```', videoUrl: '', orderIndex: 1 },
      { id: 'l2', title: 'Dictionaries & Sets', content: 'Dictionaries store data in key-value pairs for fast lookups. Sets store unique, unordered elements.\n\n```python\nmy_dict = {"name": "Alice", "age": 20}\nprint(my_dict["name"])  # Alice\n\nmy_set = {1, 2, 2, 3}  # {1, 2, 3} (duplicates automatically removed)\n```', videoUrl: '', orderIndex: 2 },
      { id: 'l3', title: 'Stacks & Queues', content: 'A Stack is a LIFO (Last-In, First-Out) structure. A Queue is a FIFO (First-In, First-Out) structure.\n\n```python\n# Stack (using list)\nstack = []\nstack.append(1)\nstack.pop()\n\n# Queue (using deque)\nfrom collections import deque\nqueue = deque([1, 2])\nqueue.append(3)\nqueue.popleft()  # 1\n```', videoUrl: '', orderIndex: 3 },
    ]
  },
  '5': {
    title: 'Database & SQL Basics', emoji: '🗄️', color: 'from-indigo-500 to-purple-500',
    description: 'Introduction to databases, SQL queries, and database design principles.',
    lessons: [
      { id: 'l1', title: 'What is a Database?', content: 'A database is an organized collection of structured data, typically stored electronically. Relational databases use tables consisting of columns and rows to model relationships.', videoUrl: '', orderIndex: 1 },
      { id: 'l2', title: 'SQL SELECT Queries', content: 'SQL (Structured Query Language) is used to query relational databases.\n\n```sql\nSELECT name, age \nFROM students \nWHERE age > 18;\n```\nThis query retrieves name and age columns of all students older than 18.', videoUrl: '', orderIndex: 2 },
      { id: 'l3', title: 'Primary & Foreign Keys', content: 'A Primary Key uniquely identifies each record in a table. A Foreign Key is a field in one table that uniquely identifies a row of another table, creating a link between them.', videoUrl: '', orderIndex: 3 },
    ]
  },
  '6': {
    title: 'Web Technologies', emoji: '🌐', color: 'from-pink-500 to-rose-500',
    description: 'HTML, CSS, JavaScript basics and how the web works.',
    lessons: [
      { id: 'l1', title: 'HTML Structure', content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It defines the structure using tags like <h1>, <p>, and <div>.', videoUrl: '', orderIndex: 1 },
      { id: 'l2', title: 'CSS Styling', content: 'CSS (Cascading Style Sheets) is used to design and format the layout of web pages. It controls colors, fonts, spacing, alignment, and responsive behaviors.', videoUrl: '', orderIndex: 2 },
      { id: 'l3', title: 'JavaScript Interactivity', content: 'JavaScript is a programming language that runs in the browser, allowing you to add dynamic features, animations, and handle user actions.\n\n```javascript\ndocument.querySelector("button").addEventListener("click", () => {\n    alert("Clicked!");\n});\n```', videoUrl: '', orderIndex: 3 },
    ]
  },
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        // If it's a mock ID (e.g. '1', '2' etc.), load directly from COURSE_DATA
        if (id && id.length < 10) {
          if (COURSE_DATA[id]) {
            setCourse(COURSE_DATA[id]);
          } else {
            setCourse(COURSE_DATA['1']);
          }
          return;
        }

        // Otherwise fetch course info from backend
        const courseRes = await axios.get(`http://localhost:5000/api/courses/${id}`);
        // Fetch lessons from backend
        const lessonsRes = await axios.get(`http://localhost:5000/api/courses/${id}/lessons`);
        
        setCourse({
          title: courseRes.data.title,
          description: courseRes.data.description,
          emoji: courseRes.data.category?.toLowerCase().includes('python') ? '🐍' : '💻',
          color: courseRes.data.category?.toLowerCase().includes('python') ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500',
          lessons: lessonsRes.data.length > 0 ? lessonsRes.data.map(l => ({
            id: l._id,
            title: l.title,
            content: l.content,
            videoUrl: l.videoUrl || '',
            orderIndex: l.orderIndex
          })) : [
            { id: 'empty', title: 'No Lessons Yet', content: 'Lessons are being developed for this course. Please check back later!', orderIndex: 1 }
          ]
        });
      } catch (err) {
        console.error('Failed to fetch course details from backend:', err);
        // Fallback to mock data
        if (COURSE_DATA[id]) {
          setCourse(COURSE_DATA[id]);
        } else {
          setCourse(COURSE_DATA['1']);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const markComplete = () => {
    if (course && !completed.includes(activeLesson)) setCompleted([...completed, activeLesson]);
    if (course && activeLesson < course.lessons.length - 1) setActiveLesson(activeLesson + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 font-medium py-20">
        Loading Course Workspace...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 font-medium py-20">
        Course not found.
      </div>
    );
  }

  const lesson = course.lessons[activeLesson] || { title: 'Untitled Lesson', content: 'No content' };

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
