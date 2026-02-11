import { Link } from 'react-router-dom';
import { PrimaryNav, TopBar } from '../components/LayoutPieces';
import { Sidebar } from '../components/Sidebars';
import { lessonCourses, quizCourses, uiStore, users } from '../data/uiStore';
import { readJson } from '../utils/storage';

const countLessons = () =>
  lessonCourses.reduce((sum, course) => sum + course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0), 0);

const countQuizzes = () => quizCourses.reduce((sum, course) => sum + course.quizzes.length, 0);

const getQuizPassRate = () => {
  const saved = readJson<{ scores?: Record<string, number> }>('edulearn_quizzes', { scores: {} });
  const scores = Object.values(saved.scores || {}).filter((value) => typeof value === 'number');
  if (!scores.length) return 0;
  const passCount = scores.filter((score) => score >= 80).length;
  return Math.round((passCount / scores.length) * 100);
};

const getAdminTables = () => {
  const tables = uiStore.admin.tables || {};
  const derivedUsers = users.map((item) => ({
    name: item.name || item.email,
    email: item.email,
    role: item.displayRole || item.role
  }));
  const derivedLessons = lessonCourses.map((course) => ({
    title: course.title,
    module: course.modules[0]?.name || 'Module 1',
    status: 'Published'
  }));
  const derivedQuizzes = quizCourses.map((course) => ({
    title: course.quizzes[0]?.title || course.title,
    module: course.quizzes[0]?.module || 'Module 1',
    status: 'Active'
  }));

  return {
    users: tables.users && tables.users.length ? tables.users : derivedUsers,
    lessons: tables.lessons && tables.lessons.length ? tables.lessons : derivedLessons,
    quizzes: tables.quizzes && tables.quizzes.length ? tables.quizzes : derivedQuizzes
  };
};

export default function DashboardAdmin() {
  const tables = getAdminTables();

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
            title="Admin"
            links={[
              { label: 'Overview', active: true },
              { label: 'Manage Users', to: '/admin/users' },
              { label: 'Manage Lessons', to: '/admin/lessons' },
              { label: 'Manage Quizzes', to: '/admin/quizzes' },
              { label: 'Quiz Attempts', to: '/admin/quiz-attempts' },
              { label: 'Logout', to: '/login' }
            ]}
          />

          <div className="animate-fadeInUp">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-primary uppercase font-semibold tracking-wider">Dashboard</p>
                <h1 className="text-4xl font-extrabold gradient-text">Admin Overview</h1>
                <p className="text-gray-600 mt-2">Manage users, lessons, quizzes, and platform performance.</p>
              </div>
              <div className="flex gap-3">
                <Link to="/lesson-create" className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300">
                  Create Lesson
                </Link>
                <Link
                  to="/quiz-create"
                  className="border-2 border-primary text-primary px-5 py-2 rounded-md font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Create Quiz
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Total Users</p>
                <h3 className="text-3xl font-bold mt-2">{users.length}</h3>
                <p className="text-xs text-gray-500 mt-2">{uiStore.admin.notes.users}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Total Lessons</p>
                <h3 className="text-3xl font-bold mt-2">{countLessons()}</h3>
                <p className="text-xs text-gray-500 mt-2">{uiStore.admin.notes.lessons}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Total Quizzes</p>
                <h3 className="text-3xl font-bold mt-2">{countQuizzes()}</h3>
                <p className="text-xs text-gray-500 mt-2">{uiStore.admin.notes.quizzes}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Quiz Pass Rate</p>
                <h3 className="text-3xl font-bold mt-2">{getQuizPassRate()}%</h3>
                <p className="text-xs text-gray-500 mt-2">{uiStore.admin.notes.passRate}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Recent Admin Actions</h3>
                <div className="grid gap-3 text-sm">
                  {uiStore.admin.actions.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span className="text-gray-500">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Pending Actions</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {uiStore.admin.pending.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Users (GET /admin/users)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-gray-500">
                      <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Role</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {tables.users.map((row) => (
                        <tr key={`${row.name}-${row.email}`}>
                          <td className="py-2">{row.name}</td>
                          <td className="py-2">{row.email}</td>
                          <td className="py-2">{row.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Lessons (GET /lessons)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-gray-500">
                      <tr>
                        <th className="py-2">Title</th>
                        <th className="py-2">Module</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {tables.lessons.map((row) => (
                        <tr key={`${row.title}-${row.module}`}>
                          <td className="py-2">{row.title}</td>
                          <td className="py-2">{row.module}</td>
                          <td className="py-2">{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Quizzes (GET /quizzes)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-gray-500">
                      <tr>
                        <th className="py-2">Title</th>
                        <th className="py-2">Module</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {tables.quizzes.map((row) => (
                        <tr key={`${row.title}-${row.module}`}>
                          <td className="py-2">{row.title}</td>
                          <td className="py-2">{row.module}</td>
                          <td className="py-2">{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
