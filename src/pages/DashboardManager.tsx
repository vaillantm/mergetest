import { PrimaryNav, TopBar } from '../components/LayoutPieces';
import { Sidebar } from '../components/Sidebars';
import { lessonCourses, quizCourses, uiStore, users } from '../data/uiStore';
import { readJson } from '../utils/storage';

const countLessons = () =>
  lessonCourses.reduce((sum, course) => sum + course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0), 0);

const countQuizzes = () => quizCourses.reduce((sum, course) => sum + course.quizzes.length, 0);

const getQuizStats = () => {
  const saved = readJson<{ scores?: Record<string, number> }>('edulearn_quizzes', { scores: {} });
  const scores = Object.values(saved.scores || {}).filter((value) => typeof value === 'number');
  if (!scores.length) return { passRate: 0, attempts: 0 };
  const passCount = scores.filter((score) => score >= 80).length;
  return { passRate: Math.round((passCount / scores.length) * 100), attempts: scores.length };
};

export default function DashboardManager() {
  const quizStats = getQuizStats();
  const learnerCount = users.filter((user) => user.role === 'learner').length;
  const activeCohorts = Math.max(1, Math.ceil(learnerCount / 5));

  return (
    <div className="bg-[#f5f8ff] text-slate-800">
      <TopBar />
      <PrimaryNav
        variant="dashboard"
        items={[
          { label: 'Home', to: '/' }
        ]}
      />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[260px_1fr] gap-8">
          <Sidebar
            title="Manager"
            links={[
              { label: 'Overview', active: true },
              { label: 'Logout', to: '/login' }
            ]}
          />

          <div className="animate-fadeInUp">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-primary uppercase font-semibold tracking-wider">Dashboard</p>
                <h1 className="text-4xl font-extrabold gradient-text">Manager Overview</h1>
                <p className="text-gray-600 mt-2">Track cohorts, learner progress, and lesson quality.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Active Cohorts</p>
                <h3 className="text-3xl font-bold mt-2">{activeCohorts}</h3>
                <p className="text-xs text-gray-500 mt-2">From /admin/users/role/learner</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Lesson Reviews</p>
                <h3 className="text-3xl font-bold mt-2">{countLessons()}</h3>
                <p className="text-xs text-gray-500 mt-2">From /lessons</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Quiz Pass Rate</p>
                <h3 className="text-3xl font-bold mt-2">{quizStats.passRate}%</h3>
                <p className="text-xs text-gray-500 mt-2">From /quizzes/analytics</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Feedback Items</p>
                <h3 className="text-3xl font-bold mt-2">{quizStats.attempts}</h3>
                <p className="text-xs text-gray-500 mt-2">From /admin/statistics</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Cohort Performance</h3>
                <div className="grid gap-3 text-sm">
                  {uiStore.manager.performance.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span className="text-gray-500">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Tasks</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {uiStore.manager.tasks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
