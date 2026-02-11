import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryNav, TopBar } from '../components/LayoutPieces';
import { Sidebar } from '../components/Sidebars';
import { lessonCourses, uiStore } from '../data/uiStore';
import { readJson, writeJson } from '../utils/storage';

type LessonState = {
  courseIndex: number;
  lessonIndex: number;
  completed: Record<string, boolean>;
};

const storageKey = 'edulearn_lessons';

const initialState: LessonState = {
  courseIndex: 0,
  lessonIndex: 0,
  completed: {}
};

const flattenLessons = (course: (typeof lessonCourses)[number]) => {
  const list: Array<{ module: string; title: string; desc: string; cards: { title: string; body: string }[] }> = [];
  course.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      list.push({ module: mod.name, ...lesson });
    });
  });
  return list;
};

export default function Lesson() {
  const [state, setState] = useState<LessonState>(() => readJson(storageKey, initialState));

  useEffect(() => {
    writeJson(storageKey, state);
  }, [state]);

  const course = lessonCourses[state.courseIndex];
  const flat = useMemo(() => (course ? flattenLessons(course) : []), [course]);
  const lesson = flat[state.lessonIndex];

  const setCourse = (index: number) => {
    setState((prev) => ({ ...prev, courseIndex: index, lessonIndex: 0 }));
  };

  const setLesson = (index: number) => {
    setState((prev) => ({ ...prev, lessonIndex: Math.max(0, Math.min(index, flat.length - 1)) }));
  };

  const markComplete = () => {
    if (!course) return;
    const key = `${course.id}:${state.lessonIndex}`;
    setState((prev) => ({
      ...prev,
      completed: { ...prev.completed, [key]: true },
      lessonIndex: Math.min(prev.lessonIndex + 1, flat.length - 1)
    }));
  };

  if (!course || !lesson) {
    return null;
  }

  const completedCount = Object.keys(state.completed).filter((key) => key.startsWith(course.id)).length;
  const percent = flat.length ? Math.round((completedCount / flat.length) * 100) : 0;
  const nextIndex = Math.min(state.lessonIndex + 1, flat.length - 1);

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
              { label: 'My Lessons', active: true },
              { label: 'My Quizzes', to: '/quiz' },
              { label: 'Logout', to: '/login' }
            ]}
          />

          <div className="animate-fadeInUp">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <p className="text-primary uppercase font-semibold tracking-wider">{uiStore.lesson.eyebrow}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold mt-3 gradient-text">{course.title}</h1>
                <p className="text-gray-600 mt-3">{uiStore.lesson.description}</p>
              </div>
              <div className="flex gap-3">
                <Link to="/quiz" className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 hover-lift">
                  Go to Quizzes
                </Link>
                <Link
                  to="/dashboard-learner"
                  className="border-2 border-primary text-primary px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-white transition-all duration-300 hover-lift"
                >
                  My Progress
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <p className="text-sm text-gray-500 mb-3">Course Tracks</p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {lessonCourses.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCourse(idx)}
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

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-blue-50 px-3 py-1 rounded-full">
                  {lesson.module}
                </span>
                <span className="text-sm text-gray-500">Lesson {state.lessonIndex + 1} of {flat.length}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">{lesson.title}</h2>
              <p className="text-gray-600 mb-4">{lesson.desc}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {lesson.cards.map((card) => (
                  <div key={card.title} className="p-5 rounded-lg bg-[#f5f8ff] border border-blue-100">
                    <h3 className="font-bold mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  id="mark-complete"
                  onClick={markComplete}
                  className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300"
                >
                  Mark Complete
                </button>
                <button
                  id="prev-lesson"
                  onClick={() => setLesson(state.lessonIndex - 1)}
                  disabled={state.lessonIndex === 0}
                  className={`border-2 border-primary text-primary px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-white transition-all duration-300 ${
                    state.lessonIndex === 0 ? 'opacity-50' : ''
                  }`}
                >
                  Previous
                </button>
                <button
                  id="next-lesson"
                  onClick={() => setLesson(state.lessonIndex + 1)}
                  disabled={state.lessonIndex >= flat.length - 1}
                  className={`border-2 border-primary text-primary px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-white transition-all duration-300 ${
                    state.lessonIndex >= flat.length - 1 ? 'opacity-50' : ''
                  }`}
                >
                  Next Lesson
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">Lesson Progress</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                {flat.map((item, idx) => {
                  const key = `${course.id}:${idx}`;
                  const completed = !!state.completed[key];
                  const isCurrent = idx === state.lessonIndex;
                  const isLocked = idx > state.lessonIndex + 1;
                  return (
                    <label key={key} className="flex items-center gap-2">
                      <input type="checkbox" className="accent-primary" checked={completed} disabled />
                      <span>
                        {isCurrent ? 'Current: ' : ''}
                        {item.title}
                        {isLocked ? ' (locked)' : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold mb-4">Course Progress</h3>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
                <p className="text-sm text-gray-600">{percent}% complete</p>
                <div className="mt-4 text-xs text-gray-500">Complete this lesson to unlock: {flat[nextIndex]?.title}.</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold mb-4">Next Lessons</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {flat.slice(state.lessonIndex + 1, Math.min(state.lessonIndex + 4, flat.length)).map((item) => (
                    <li key={item.title} className="flex items-center justify-between">
                      <span>{item.title}</span>
                      <span className="text-gray-400">Locked</span>
                    </li>
                  ))}
                </ul>
                <button
                  id="continue-btn"
                  onClick={() => setLesson(state.lessonIndex + 1)}
                  className="mt-6 w-full py-3 rounded-md font-semibold transition border-2 border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
