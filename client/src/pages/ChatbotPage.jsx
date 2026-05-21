import { useState, useRef, useEffect } from 'react';

const FAQ = [
  { keywords: ['quiz', 'test', 'exam'], answer: '📝 To take a quiz, go to the **Courses** page, select a course, and click **Take Quiz** at the bottom of the lesson sidebar.' },
  { keywords: ['certificate', 'cert'], answer: '🎓 Certificates are awarded after you complete all lessons in a course and score 70%+ on the final quiz.' },
  { keywords: ['enroll', 'join', 'signup'], answer: '✅ To enroll, go to the **Courses** page, find a course you like, and click the **Enroll** button.' },
  { keywords: ['score', 'result', 'grade'], answer: '📊 Your quiz results are shown immediately after you submit. You can also see your overall average score on your Dashboard.' },
  { keywords: ['badge', 'point', 'reward'], answer: '🏆 You earn points by completing lessons and passing quizzes. Badges are unlocked as you hit milestones!' },
  { keywords: ['weak', 'struggle', 'improve', 'help'], answer: '💡 After each quiz, we detect weak areas based on wrong answers and recommend targeted lessons on your Dashboard.' },
  { keywords: ['lesson', 'material', 'content', 'video'], answer: '📚 Lesson materials are available inside each course. Click a course, then select any lesson from the sidebar to start reading.' },
  { keywords: ['password', 'login', 'account'], answer: '🔐 If you forgot your password, please contact your instructor or admin to reset it.' },
  { keywords: ['python', 'ict', 'course', 'available'], answer: '🐍 We currently offer: Python for Beginners, ICT Fundamentals, Python OOP, Data Structures, Database & SQL, and Web Technologies.' },
];

const getReply = (msg) => {
  const lower = msg.toLowerCase();
  for (const item of FAQ) {
    if (item.keywords.some(k => lower.includes(k))) return item.answer;
  }
  return "🤖 I'm not sure about that. Try asking about: quizzes, certificates, enrolling, scores, badges, lessons, or available courses!";
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Hi! I\'m your EduLMS assistant. Ask me anything about your courses, quizzes, badges, or progress!' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = getReply(input);
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
    }, 800);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const suggestions = ['How do I take a quiz?', 'How do I earn badges?', 'What courses are available?'];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">💬 Student Support</h1>
        <p className="text-slate-500 text-sm">Ask the chatbot anything about EduLMS.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col" style={{ height: '60vh' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.from === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold mr-2 flex-shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${m.from === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-700 rounded-bl-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm mr-2">🤖</div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2 mb-2 flex-wrap">
            {suggestions.map(s => (
              <button key={s} onClick={() => { setInput(s); }}
                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-all">
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your question..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50"
            />
            <button onClick={sendMessage}
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm">
              Send →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
