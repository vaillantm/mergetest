import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer, PrimaryNav, TopBar } from '../components/LayoutPieces';
import { authPassword, uiStore, users } from '../data/uiStore';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    const user = users.find((item) => item.email === normalized);

    if (!user || password !== authPassword) {
      setMessage({
        text: 'Invalid credentials. Use a@io.com, l@io.com, or m@io.com with password123.',
        type: 'error'
      });
      return;
    }

    setMessage({ text: 'Login successful. Redirecting...', type: 'success' });
    window.setTimeout(() => {
      navigate(user.redirect);
    }, 800);
  };

  return (
    <div className="bg-white text-slate-800">
      <TopBar />
      <PrimaryNav variant="public" />

      <section className="pt-32 pb-20 bg-[#f5f8ff]">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideInLeft">
            <p className="text-primary uppercase font-semibold tracking-wider">Welcome</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-3 gradient-text">Login to Continue Learning</h1>
            <p className="text-gray-600 mt-4">Access lessons, track progress, and complete quizzes with your account.</p>
          </div>

          <div className="bg-white shadow-2xl rounded-xl p-10 animate-scaleIn">
            <h2 className="text-2xl font-bold mb-2">Login</h2>
            <p className="text-sm text-gray-500 mb-6">{uiStore.login.hint}</p>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="p-4 text-gray-800 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  className="p-4 text-gray-800 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" /> Remember me
                </label>
                <Link to="/forgot-password" className="text-primary font-semibold">
                  Forgot password?
                </Link>
              </div>

              <button className="bg-primary text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 hover-lift">
                Login
              </button>
            </form>

            {message ? (
              <p className={`text-sm mt-4 ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</p>
            ) : null}

            <p className="text-sm text-gray-600 mt-6">
              No account?{' '}
              <Link to="/signup" className="text-primary font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
