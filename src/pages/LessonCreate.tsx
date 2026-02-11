import { Link } from 'react-router-dom';
import { PrimaryNav, TopBar } from '../components/LayoutPieces';
import { Sidebar } from '../components/Sidebars';
import { AdminFormFields } from '../components/AdminFormFields';
import { uiStore } from '../data/uiStore';

export default function LessonCreate() {
  return (
    <div className="bg-[#f5f8ff] text-slate-800">
      <TopBar animated={false} />
      <PrimaryNav
        variant="admin"
        items={[
          { label: 'Dashboard', to: '/dashboard-admin' },
          { label: 'Lessons', to: '/admin/lessons' },
          { label: 'Create Lesson', to: '/lesson-create', className: 'text-primary font-semibold' }
        ]}
      />

      <section className="max-w-7xl mx-auto px-6 pt-32 pb-10 grid lg:grid-cols-[260px_1fr] gap-8">
        <Sidebar
          title="Admin"
          links={[
            { label: 'Overview', to: '/dashboard-admin' },
            { label: 'Manage Users', to: '/admin/users' },
            { label: 'Manage Lessons', to: '/admin/lessons' },
            { label: 'Manage Quizzes', to: '/admin/quizzes' },
            { label: 'Quiz Attempts', to: '/admin/quiz-attempts' },
            { label: 'Logout', to: '/login' }
          ]}
        />

        <div>
          <div className="mb-6">
            <p className="text-primary uppercase font-semibold tracking-wider">POST /lessons</p>
            <h1 className="text-3xl font-extrabold">Create Lesson</h1>
            <p className="text-gray-600 mt-2">Form fields match the Lesson model in xmd.md.</p>
          </div>

          <form className="bg-white rounded-xl shadow-lg p-6 grid gap-5">
            <AdminFormFields fields={uiStore.forms.lessonCreate} />
            <div className="flex gap-3">
              <button type="submit" className="bg-primary text-white px-5 py-2 rounded-md font-semibold">
                Save Lesson
              </button>
              <Link to="/admin/lessons" className="border-2 border-primary text-primary px-5 py-2 rounded-md font-semibold">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
