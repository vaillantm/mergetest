import { Link } from 'react-router-dom';
import { PrimaryNav, TopBar } from '../components/LayoutPieces';
import { Sidebar } from '../components/Sidebars';
import { AdminTable } from '../components/AdminTable';
import { uiStore } from '../data/uiStore';

export default function AdminQuizzes() {
  return (
    <div className="bg-[#f5f8ff] text-slate-800">
      <TopBar animated={false} />
      <PrimaryNav
        variant="admin"
        items={[
          { label: 'Dashboard', to: '/dashboard-admin' },
          { label: 'Users', to: '/admin/users' },
          { label: 'Lessons', to: '/admin/lessons' },
          { label: 'Quizzes', to: '/admin/quizzes', className: 'text-primary font-semibold' },
          { label: 'Attempts', to: '/admin/quiz-attempts' }
        ]}
      />

      <section className="max-w-7xl mx-auto px-6 pt-32 pb-10 grid lg:grid-cols-[260px_1fr] gap-8">
        <Sidebar
          title="Admin"
          links={[
            { label: 'Overview', to: '/dashboard-admin' },
            { label: 'Manage Users', to: '/admin/users' },
            { label: 'Manage Lessons', to: '/admin/lessons' },
            { label: 'Manage Quizzes', active: true },
            { label: 'Quiz Attempts', to: '/admin/quiz-attempts' },
            { label: 'Logout', to: '/login' }
          ]}
        />

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary uppercase font-semibold tracking-wider">/quizzes</p>
              <h1 className="text-3xl font-extrabold">Quizzes</h1>
            </div>
            <Link to="/quiz-create" className="bg-primary text-white px-4 py-2 rounded-md font-semibold">
              Create Quiz
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <AdminTable columns={uiStore.models.quizzes} rows={uiStore.admin.tables.quizzes} />
          </div>
        </div>
      </section>
    </div>
  );
}
