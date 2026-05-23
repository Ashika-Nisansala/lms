import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const scoreData = [
  { lesson: 'Variables', avg: 85 },
  { lesson: 'Loops', avg: 62 },
  { lesson: 'Functions', avg: 74 },
  { lesson: 'OOP', avg: 55 },
  { lesson: 'Lists', avg: 80 },
];

const enrollData = [
  { month: 'Jan', students: 20 },
  { month: 'Feb', students: 35 },
  { month: 'Mar', students: 50 },
  { month: 'Apr', students: 42 },
  { month: 'May', students: 68 },
];

const MOCK_STUDENTS = [
  { id: 'mock1', name: 'Alice Tan', email: 'alice@uni.edu', score: 88, progress: 75, status: 'Active' },
  { id: 'mock2', name: 'Bob Malik', email: 'bob@uni.edu', score: 62, progress: 40, status: 'Active' },
  { id: 'mock3', name: 'Chloe Lee', email: 'chloe@uni.edu', score: 95, progress: 90, status: 'Active' },
  { id: 'mock4', name: 'David Obi', email: 'david@uni.edu', score: 45, progress: 25, status: 'Inactive' },
];

const COURSES_LIST = [
  { id: '1', title: 'Python for Beginners', category: 'Python', lessons: 12, enrolled: 204, emoji: '🐍' },
  { id: '2', title: 'ICT Fundamentals', category: 'ICT', lessons: 10, enrolled: 189, emoji: '💻' },
  { id: '3', title: 'Python OOP', category: 'Python', lessons: 8, enrolled: 98, emoji: '🔧' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [studentList, setStudentList] = useState(MOCK_STUDENTS);
  const [coursesList, setCoursesList] = useState(COURSES_LIST);

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Python');
  const [courseDescription, setCourseDescription] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/students');
        const backendStudents = res.data.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          score: u.points > 0 ? Math.min(100, Math.round(u.points / 10)) : 80,
          progress: u.enrolledCourses?.length > 0 ? Math.min(100, u.enrolledCourses.length * 25) : 50,
          status: 'Active'
        }));

        const merged = [...MOCK_STUDENTS];
        backendStudents.forEach(bs => {
          if (!merged.some(ms => ms.email.toLowerCase() === bs.email.toLowerCase())) {
            merged.push(bs);
          }
        });
        setStudentList(merged);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        const backendCourses = res.data.map(bc => {
          const category = bc.category || '';
          return {
            id: bc._id,
            title: bc.title || 'Untitled Course',
            category: category,
            description: bc.description || '',
            lessons: bc.lessons?.length || 0,
            enrolled: 0,
            emoji: category.toLowerCase().includes('python') ? '🐍' : '💻'
          };
        });

        const merged = [...backendCourses];
        COURSES_LIST.forEach(mc => {
          if (!merged.some(bc => bc.title.toLowerCase() === mc.title.toLowerCase())) {
            merged.push(mc);
          }
        });
        setCoursesList(merged);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    fetchStudents();
    fetchCourses();
  }, []);

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to remove student "${student.name}"?`)) {
      try {
        if (student.id && !student.id.startsWith('mock')) {
          await axios.delete(`http://localhost:5000/api/auth/students/${student.id}`);
        }
        setStudentList(prev => prev.filter(s => s.email.toLowerCase() !== student.email.toLowerCase()));
      } catch (err) {
        console.error('Failed to delete student:', err);
        alert(err.response?.data?.message || 'Failed to remove student. Please try again.');
      }
    }
  };

  const handleOpenModal = (mode, course = null) => {
    setModalMode(mode);
    if (mode === 'edit' && course) {
      setSelectedCourse(course);
      setCourseTitle(course.title);
      setCourseCategory(course.category);
      setCourseDescription(course.description || '');
    } else {
      setSelectedCourse(null);
      setCourseTitle('');
      setCourseCategory('Python');
      setCourseDescription('');
    }
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (course) => {
    if (window.confirm(`Are you sure you want to delete course "${course.title}"?`)) {
      try {
        const isMock = !course.id || course.id.length < 10;
        if (!isMock) {
          await axios.delete(`http://localhost:5000/api/courses/${course.id}`);
        }
        setCoursesList(prev => prev.filter(c => c.id !== course.id));
      } catch (err) {
        console.error('Failed to delete course:', err);
        alert(err.response?.data?.message || 'Failed to delete course. Please try again.');
      }
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDescription.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      if (modalMode === 'create') {
        const courseData = {
          title: courseTitle,
          category: courseCategory,
          description: courseDescription,
          instructorId: user?.id || '64cf288f6c3ea8c7750fa4e1'
        };

        let newCourse;
        try {
          const res = await axios.post('http://localhost:5000/api/courses', courseData);
          newCourse = {
            id: res.data._id,
            title: res.data.title,
            category: res.data.category,
            description: res.data.description,
            lessons: 0,
            enrolled: 0,
            emoji: res.data.category.toLowerCase().includes('python') ? '🐍' : '💻'
          };
        } catch (apiErr) {
          console.warn('Backend API failed, creating locally:', apiErr);
          newCourse = {
            id: 'mock_' + Date.now(),
            title: courseTitle,
            category: courseCategory,
            description: courseDescription,
            lessons: 0,
            enrolled: 0,
            emoji: courseCategory.toLowerCase().includes('python') ? '🐍' : '💻'
          };
        }
        setCoursesList(prev => [...prev, newCourse]);
      } else {
        const courseData = {
          title: courseTitle,
          category: courseCategory,
          description: courseDescription
        };

        const isMock = !selectedCourse.id || selectedCourse.id.length < 10;
        if (!isMock) {
          try {
            await axios.put(`http://localhost:5000/api/courses/${selectedCourse.id}`, courseData);
          } catch (apiErr) {
            console.warn('Backend API failed to update, updating locally:', apiErr);
          }
        }
        setCoursesList(prev => prev.map(c => 
          c.id === selectedCourse.id 
            ? { ...c, title: courseTitle, category: courseCategory, description: courseDescription, emoji: courseCategory.toLowerCase().includes('python') ? '🐍' : '💻' } 
            : c
        ));
      }
      setIsModalOpen(false);
      setActiveTab('courses');
    } catch (err) {
      console.error('Failed to save course:', err);
      alert('Failed to save course. Please try again.');
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'courses', label: '📚 Courses' },
    { id: 'students', label: '👥 Students' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-black">Instructor Dashboard</h1>
          <p className="text-slate-300 mt-1">Manage courses, track student progress, and view analytics.</p>
        </div>
        <button onClick={() => handleOpenModal('create')} className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer active:scale-95">
          + Create New Course
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-1 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: studentList.length.toString(), icon: '👥', color: 'bg-blue-50 text-blue-700' },
              { label: 'Active Courses', value: coursesList.length.toString(), icon: '📚', color: 'bg-green-50 text-green-700' },
              { label: 'Quizzes Created', value: '24', icon: '📝', color: 'bg-amber-50 text-amber-700' },
              { label: 'Avg Score', value: '73%', icon: '🎯', color: 'bg-purple-50 text-purple-700' },
            ].map(s => (
              <div key={s.label} className={`${s.color} rounded-2xl p-5 flex items-center gap-4`}>
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-xs font-medium opacity-70">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 mb-4">📈 Avg Score by Topic</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="lesson" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Avg Score']} />
                  <Bar dataKey="avg" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 mb-4">👥 Monthly Enrollments</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={enrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-amber-800 mb-2">⚠️ Weak Area Alert</h3>
            <p className="text-amber-700 text-sm">Students are struggling most with <strong>OOP (55%)</strong> and <strong>Loops (62%)</strong>. Consider adding more practice materials for these topics.</p>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-4 animate-fade-in">
          {coursesList.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="text-4xl">{course.emoji}</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{course.title}</h3>
                <p className="text-sm text-slate-500 font-medium mb-1">{course.category} • {course.lessons || 0} lessons • {course.enrolled || 0} enrolled</p>
                {course.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{course.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal('edit', course)} className="px-3 py-1.5 text-xs font-semibold border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer">✏️ Edit</button>
                <button onClick={() => handleDeleteCourse(course)} className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Avg Score</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Progress</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((s, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 text-sm">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-sm ${s.score >= 80 ? 'text-green-600' : s.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {s.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 w-24">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteStudent(s)}
                      className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-1 ml-auto cursor-pointer">
                      🗑️ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg mx-4 p-6 relative animate-slide-up">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-lg font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              {modalMode === 'create' ? '✨ Create New Course' : '✏️ Edit Course'}
            </h2>
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-1">Course Title</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300 text-slate-800 text-sm font-medium"
                  placeholder="e.g. Python Web Development"
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-1">Category</label>
                <select 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 text-sm font-medium cursor-pointer"
                  value={courseCategory}
                  onChange={e => setCourseCategory(e.target.value)}
                  required
                >
                  <option value="Python">Python 🐍</option>
                  <option value="ICT">ICT Fundamental 💻</option>
                  <option value="Web Development">Web Development 🌐</option>
                  <option value="Data Science">Data Science 📊</option>
                  <option value="JavaScript">JavaScript ⚡</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-1">Description</label>
                <textarea 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300 h-28 resize-none text-slate-800 text-sm font-medium"
                  placeholder="Describe the course goals, syllabus outline, or prerequisites..."
                  value={courseDescription}
                  onChange={e => setCourseDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md hover:shadow-lg transition-all rounded-xl cursor-pointer"
                >
                  {modalMode === 'create' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
