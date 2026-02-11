import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryNav, TopBar } from '../components/LayoutPieces';
import { Sidebar } from '../components/Sidebars';
import { api } from '../utils/api';

export default function DashboardInstructor() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const load = () => {
      setLoading(true);

      const lessonsReq = api.lessons.list()
        .then((res) => {
          if (!mounted) return;
          setLessons(res.data.lessons || []);
        })
        .catch((err) => {
          if (!mounted) return;
          setError(err?.message || 'Failed to load lessons.');
        });

      const quizzesReq = api.quizzes.list()
        .then((res) => {
          if (!mounted) return;
          setQuizzes(res.data.quizzes || []);
        })
        .catch((err) => {
          if (!mounted) return;
          setError(err?.message || 'Failed to load quizzes.');
        });

      Promise.allSettled([lessonsReq, quizzesReq]).finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const lessonRows = lessons.slice(0, 6).map((item) => ({
    id: item._id,
    title: item.title || '—',
    module: item.category || 'General',
    status: item.isPublished === false ? 'Draft' : 'Published'
  }));

  const quizRows = quizzes.slice(0, 6).map((item) => ({
    id: item._id,
    title: item.title || '—',
    module: item.lesson?.title || item.lesson || 'Lesson',
    status: item.isActive === false ? 'Paused' : 'Active'
  }));

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
            title="Instructor"
            links={[
              { label: 'Overview', active: true },
              { label: 'Manage Lessons', to: '/admin-lessons' },
              { label: 'Manage Quizzes', to: '/admin-quizzes' },
              { label: 'Logout', to: '/login' }
            ]}
          />

          <div className="animate-fadeInUp">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-primary uppercase font-semibold tracking-wider">Dashboard</p>
                <h1 className="text-4xl font-extrabold gradient-text">Instructor Overview</h1>
                <p className="text-gray-600 mt-2">Manage lessons, quizzes, and classroom performance.</p>
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

            {error ? <p className="text-red-600 text-sm mb-6">{error}</p> : null}
            {loading ? <p className="text-gray-500 text-sm mb-6">Loading dashboard data...</p> : null}

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Total Lessons</p>
                <h3 className="text-3xl font-bold mt-2">{lessons.length}</h3>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <p className="text-sm text-gray-500">Total Quizzes</p>
                <h3 className="text-3xl font-bold mt-2">{quizzes.length}</h3>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Lessons</h3>
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
                      {lessonRows.map((row, index) => (
                        <tr key={row.id || `${row.title}-${row.module}-${index}`}>
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
                <h3 className="text-xl font-bold mb-4">Quizzes</h3>
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
                      {quizRows.map((row, index) => (
                        <tr key={row.id || `${row.title}-${row.module}-${index}`}>
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
