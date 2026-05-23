import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const COURSES = [
  { id: '1', title: 'Python for Beginners', category: 'Python', description: 'Start your Python journey from scratch. Learn variables, loops, functions and more.', lessons: 12, level: 'Beginner', color: 'from-blue-500 to-cyan-500', emoji: '🐍' },
  { id: '2', title: 'ICT Fundamentals', category: 'ICT', description: 'Understand computers, networks, the internet and digital literacy concepts.', lessons: 10, level: 'Beginner', color: 'from-purple-500 to-pink-500', emoji: '💻' },
  { id: '3', title: 'Python OOP', category: 'Python', description: 'Master Object Oriented Programming in Python: classes, inheritance, polymorphism.', lessons: 8, level: 'Intermediate', color: 'from-green-500 to-teal-500', emoji: '🔧' },
  { id: '4', title: 'Data Structures with Python', category: 'Python', description: 'Lists, tuples, dictionaries, sets, stacks and queues explained with Python.', lessons: 10, level: 'Intermediate', color: 'from-orange-500 to-red-500', emoji: '📊' },
  { id: '5', title: 'Database & SQL Basics', category: 'ICT', description: 'Introduction to databases, SQL queries, and database design principles.', lessons: 9, level: 'Beginner', color: 'from-indigo-500 to-purple-500', emoji: '🗄️' },
  { id: '6', title: 'Web Technologies', category: 'ICT', description: 'HTML, CSS, JavaScript basics and how the web works.', lessons: 14, level: 'Beginner', color: 'from-pink-500 to-rose-500', emoji: '🌐' },
];

export default function Courses() {
  const [coursesList, setCoursesList] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        const backendCourses = res.data.map(bc => ({
          id: bc._id,
          title: bc.title,
          category: bc.category,
          description: bc.description,
          lessons: bc.lessonsCount || 0,
          level: bc.category?.toLowerCase().includes('python') ? 'Beginner' : 'Intermediate',
          color: bc.category?.toLowerCase().includes('python') ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500',
          emoji: bc.category?.toLowerCase().includes('python') ? '🐍' : '💻'
        }));

        const merged = [...backendCourses];
        COURSES.forEach(mc => {
          if (!merged.some(bc => bc.title.toLowerCase() === mc.title.toLowerCase())) {
            merged.push(mc);
          }
        });
        setCoursesList(merged);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCoursesList(COURSES);
      }
    };
    fetchCourses();
  }, []);

  const filtered = coursesList.filter(c =>
    (filter === 'All' || c.category === filter) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Course Catalog</h1>
          <p className="text-slate-500">Explore all available courses and start learning today.</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search courses..."
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-slate-700 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {['All', 'Python', 'ICT'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <div key={course.id} onClick={() => navigate(`/student/course/${course.id}`)}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`h-36 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
              <span className="text-6xl">{course.emoji}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{course.category}</span>
                <span className="text-xs text-slate-400 font-medium">{course.level}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{course.title}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-slate-400">📚 {course.lessons} Lessons</span>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Enroll →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
