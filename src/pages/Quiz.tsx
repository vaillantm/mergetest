import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryNav, TopBar } from '../components/LayoutPieces';
import { Sidebar } from '../components/Sidebars';
import { lessonCourses, quizCourses, uiStore } from '../data/uiStore';
import { readJson, writeJson } from '../utils/storage';

type QuizState = {
  courseIndex: number;
  completedQuizzes: Record<string, boolean>;
  scores: Record<string, number>;
};

type ActiveQuiz = {
  courseId: string;
  quizIndex: number;
  title: string;
  module: string;
  questions: { q: string; options: string[]; answer: number }[];
};

const storageKey = 'edulearn_quizzes';
const lessonStorageKey = 'edulearn_lessons';

const initialState: QuizState = {
  courseIndex: 0,
  completedQuizzes: {},
  scores: {}
};

const getLessonProgress = (courseId: string) => {
  const saved = readJson<{ completed?: Record<string, boolean> }>(lessonStorageKey, { completed: {} });
  const completed = Object.keys(saved.completed || {}).filter((key) => key.startsWith(courseId)).length;
  return completed;
};

const getLessonTotal = (courseId: string) => {
  const course = lessonCourses.find((item) => item.id === courseId);
  if (!course) return 0;
  return course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
};

export default function Quiz() {
  const [state, setState] = useState<QuizState>(() => readJson(storageKey, initialState));
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  const course = quizCourses[state.courseIndex];

  const quizUnlocked = (courseId: string, quizIndex: number) => {
    if (quizIndex === 0) return true;
    const totalLessons = getLessonTotal(courseId);
    if (totalLessons === 0) return false;
    const progress = getLessonProgress(courseId);
    const perQuiz = Math.ceil(totalLessons / Math.max(1, course.quizzes.length));
    return progress >= perQuiz * quizIndex;
  };

  const openQuiz = (quiz: ActiveQuiz) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setResult('');
    setShowFeedback(false);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
  };

  const submitQuiz = () => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        score += 1;
      }
    });
    const percent = Math.round((score / activeQuiz.questions.length) * 100);
    setResult(`Score: ${score}/${activeQuiz.questions.length} (${percent}%)`);
    setShowFeedback(true);

    const key = `${activeQuiz.courseId}:${activeQuiz.quizIndex}`;
    const next = {
      ...state,
      completedQuizzes: { ...state.completedQuizzes, [key]: true },
      scores: { ...state.scores, [key]: percent }
    };
    setState(next);
    writeJson(storageKey, next);
  };

  const summary = useMemo(() => {
    if (!course) return { completed: 0, avg: 0, next: 'Complete Lessons' };
    const total = course.quizzes.length;
    const completed = course.quizzes.filter((_, idx) => state.completedQuizzes[`${course.id}:${idx}`]).length;
    const scores = course.quizzes.map((_, idx) => state.scores[`${course.id}:${idx}`]).filter(Boolean) as number[];
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const nextIndex = course.quizzes.findIndex((_, idx) => !state.completedQuizzes[`${course.id}:${idx}`]);
    const next = nextIndex === -1 ? 'All Quizzes Complete' : course.quizzes[nextIndex].title;
    return { completed, avg, next, total };
  }, [course, state.completedQuizzes, state.scores]);

  if (!course) {
    return null;
  }

  return (
    <div className="bg-[#f5f8ff] text-slate-800">
      <TopBar />
      <PrimaryNav
        variant="dashboard"
        items={[
          { label: 'Home', to: '/' },
          { label: 'Lessons', to: '/lesson' },
          { label: 'Quiz', to: '/quiz' }
        ]}
      />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[260px_1fr] gap-8">
          <Sidebar
            title="Learner"
            links={[
              { label: 'Overview', to: '/dashboard-learner' },
              { label: 'My Lessons', to: '/lesson' },
              { label: 'My Quizzes', active: true },
              { label: 'Logout', to: '/login' }
            ]}
          />

          <div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 animate-fadeInUp">
              <div>
                <p className="text-primary uppercase font-semibold tracking-wider">{uiStore.quiz.eyebrow}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold mt-3 gradient-text">{course.title}</h1>
                <p className="text-gray-600 mt-3 max-w-2xl">{uiStore.quiz.description}</p>
              </div>
              <div className="flex gap-3">
                <Link to="/dashboard-learner" className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 hover-lift">
                  View Progress
                </Link>
                <Link
                  to="/lesson"
                  className="border-2 border-primary text-primary px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-white transition-all duration-300 hover-lift"
                >
                  Go to Lessons
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <p className="text-sm text-gray-500 mb-3">Course Tracks</p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {quizCourses.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setState((prev) => ({ ...prev, courseIndex: idx }))}
                    className={
                      idx === state.courseIndex
                        ? 'border-2 border-primary text-primary rounded-lg px-4 py-3 font-semibold text-left'
                        : 'border border-gray-200 rounded-lg px-4 py-3 text-gray-600 text-left hover:border-primary hover:text-primary transition'
                    }
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {course.quizzes.map((quiz, idx) => {
                const unlocked = quizUnlocked(course.id, idx);
                const key = `${course.id}:${idx}`;
                return (
                  <div
                    key={quiz.title}
                    className={`p-8 bg-white shadow-lg rounded-xl transition-all duration-500 group glass-effect border border-gray-100 animate-scaleIn ${
                      unlocked ? 'hover:shadow-2xl hover-lift' : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div
                        className={`w-16 h-16 bg-blue-100 text-primary rounded-lg flex items-center justify-center ${
                          unlocked ? 'group-hover:bg-primary group-hover:text-white' : ''
                        } transition-all duration-300`}
                      >
                        <i data-lucide="clipboard-check" className="w-6 h-6"></i>
                      </div>
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${
                          unlocked ? 'text-primary bg-blue-50' : 'text-gray-400 bg-gray-100'
                        } px-3 py-1 rounded-full`}
                      >
                        {unlocked ? quiz.module : 'Locked'}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${unlocked ? 'group-hover:text-primary' : ''} transition-all duration-300`}>
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {quiz.questions.length} questions, {quiz.duration}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <i data-lucide="clock" className="w-4 h-4 text-primary"></i> {quiz.duration}
                      </span>
                      <span className="flex items-center gap-2">
                        <i data-lucide="sparkles" className="w-4 h-4 text-primary"></i> {quiz.questions.length} Qs
                      </span>
                    </div>

                    {unlocked ? (
                      <button
                        onClick={() =>
                          openQuiz({
                            courseId: course.id,
                            quizIndex: idx,
                            title: quiz.title,
                            module: quiz.module,
                            questions: quiz.questions
                          })
                        }
                        className="mt-6 w-full py-3 rounded-md font-semibold transition border-2 border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        {state.completedQuizzes[key] ? 'Retake Quiz' : 'Start Quiz'}
                      </button>
                    ) : (
                      <button className="mt-6 w-full py-3 rounded-md font-semibold border-2 border-gray-300 text-gray-400 cursor-not-allowed" disabled>
                        Complete Lessons to Unlock
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-10 animate-fadeInUp">
              <div className="bg-[#f5f8ff] border border-blue-100 rounded-xl p-6">
                <p className="text-sm uppercase tracking-widest text-primary font-semibold">Progress</p>
                <h4 className="text-xl font-bold mt-2">{summary.completed} of {summary.total} Quizzes</h4>
                <p className="text-gray-600 mt-2">
                  {summary.completed < summary.total
                    ? 'Finish lessons to unlock the next assessment.'
                    : 'All quizzes completed in this track.'}
                </p>
              </div>
              <div className="bg-[#f5f8ff] border border-blue-100 rounded-xl p-6">
                <p className="text-sm uppercase tracking-widest text-primary font-semibold">Average Score</p>
                <h4 className="text-xl font-bold mt-2">{summary.avg}%</h4>
                <p className="text-gray-600 mt-2">Keep a score above 80% to pass.</p>
              </div>
              <div className="bg-[#f5f8ff] border border-blue-100 rounded-xl p-6">
                <p className="text-sm uppercase tracking-widest text-primary font-semibold">Next Step</p>
                <h4 className="text-xl font-bold mt-2">{summary.next}</h4>
                <p className="text-gray-600 mt-2">Return to lessons to unlock more quizzes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeQuiz ? (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">{course.title} • {activeQuiz.module}</p>
                <h3 className="text-2xl font-bold">{activeQuiz.title}</h3>
              </div>
              <button onClick={closeQuiz} className="text-gray-500 hover:text-primary">Close</button>
            </div>
            <div className="space-y-6">
              {activeQuiz.questions.map((q, idx) => (
                <div key={`${q.q}-${idx}`} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-semibold mb-3">{idx + 1}. {q.q}</p>
                  <div className="grid gap-2">
                    {q.options.map((opt, optIdx) => (
                      <label key={opt} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={optIdx}
                          className="accent-primary"
                          checked={answers[idx] === optIdx}
                          onChange={() => setAnswers((prev) => ({ ...prev, [idx]: optIdx }))}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {showFeedback ? (
                    <p className={`mt-2 text-sm ${answers[idx] === q.answer ? 'text-green-600' : 'text-red-600'}`}>
                      {answers[idx] === q.answer ? 'Correct' : `Incorrect. Correct answer: ${q.options[q.answer]}`}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">{result}</div>
              <button onClick={submitQuiz} className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


