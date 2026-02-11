import { Link } from 'react-router-dom';
import { PrimaryNav, TopBar } from '../components/LayoutPieces';
import { Sidebar } from '../components/Sidebars';
import { lessonCourses, quizCourses, uiStore } from '../data/uiStore';
import { readJson } from '../utils/storage';

const countLessons = () =>
  lessonCourses.reduce((sum, course) => sum + course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0), 0);

const getLessonState = () => readJson<{ completed?: Record<string, boolean> }>('edulearn_lessons', { completed: {} });

const getQuizState = () =>
  readJson<{ completedQuizzes?: Record<string, boolean>; scores?: Record<string, number> }>('edulearn_quizzes', {
    completedQuizzes: {},
    scores: {}
  });

export default function DashboardLearner() {
  const lessonState = getLessonState();
  const quizState = getQuizState();
  const totalLessons = countLessons();
  const completedLessons = Object.keys(lessonState.completed || {}).length;
  const completedQuizzes = Object.keys(quizState.completedQuizzes || {}).length;
  const scores = Object.values(quizState.scores || {}).filter((value) => typeof value === 'number');
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

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
              { label: 'Overview', active: true },
              { label: 'My Lessons', to: '/lesson' },
              { label: 'My Quizzes', to: '/quiz' },
              { label: 'Logout', to: '/login' }
            ]}
          />

          <div className="animate-fadeInUp">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-primary uppercase font-semibold tracking-wider">Dashboard</p>
                <h1 className="text-4xl font-extrabold gradient-text">Learner Overview</h1>
                <p className="text-gray-600 mt-2">Continue where you left off.</p>
              </div>
              <div className="flex gap-3">
                <Link to="/lesson" className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300">
                  Resume Lesson
                </Link>
                <Link
                  to="/quiz"
                  className="border-2 border-primary text-primary px-5 py-2 rounded-md font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Take Quiz
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Lessons Available</p>
                <h3 className="text-3xl font-bold mt-2">{totalLessons}</h3>
                <p className="text-xs text-gray-500 mt-2">{uiStore.statsNotes.lessons}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Lessons Completed</p>
                <h3 className="text-3xl font-bold mt-2">{completedLessons}</h3>
                <p className="text-xs text-green-600 mt-2">Based on lesson progress</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Quiz Average</p>
                <h3 className="text-3xl font-bold mt-2">{avg}%</h3>
                <p className="text-xs text-gray-500 mt-2">From /quizzes/analytics</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Quizzes Completed</p>
                <h3 className="text-3xl font-bold mt-2">{completedQuizzes}</h3>
                <p className="text-xs text-gray-500 mt-2">From /quizzes</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Continue Learning</h3>
                <div className="grid gap-3 text-sm">
                  {uiStore.learner.continueLessons.length ? (
                    uiStore.learner.continueLessons.slice(0, 3).map((lesson) => (
                      <div key={lesson.title} className="flex items-center justify-between">
                        <span>{lesson.title}</span>
                        <Link to="/lesson" className="text-primary font-semibold">
                          Open
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No lesson data available.</p>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Upcoming Quizzes</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {uiStore.learner.upcomingQuizzes.length ? (
                    uiStore.learner.upcomingQuizzes.slice(0, 3).map((quiz) => (
                      <li key={`${quiz.module}-${quiz.title}`}>{`${quiz.module}: ${quiz.title}`}</li>
                    ))
                  ) : (
                    <li>No quiz data available.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
