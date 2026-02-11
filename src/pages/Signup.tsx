import { Link } from 'react-router-dom';
import { Footer, PrimaryNav, TopBar } from '../components/LayoutPieces';

export default function Signup() {
  return (
    <div className="bg-white text-slate-800">
      <TopBar />
      <PrimaryNav variant="public" />

      <section className="pt-32 pb-20 bg-[#f5f8ff]">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideInLeft">
            <p className="text-primary uppercase font-semibold tracking-wider">Join EduLearn</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-3 gradient-text">Create Your Learning Account</h1>
            <p className="text-gray-600 mt-4">Sign up as a learner or instructor to start using the platform.</p>
          </div>

          <div className="bg-white shadow-2xl rounded-xl p-10 animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

            <form className="grid gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="p-4 text-gray-800 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <p className="text-xs text-gray-500">Must be unique and lowercase (e.g. name@example.com).</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                  className="p-4 text-gray-800 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <p className="text-xs text-gray-500">Minimum 8 characters.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Role</label>
                <select
                  required
                  className="p-4 text-gray-800 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                >
                  <option value="learner">Learner</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-primary" />
                <span>I agree to the Terms and Privacy Policy</span>
              </div>

              <button className="bg-primary text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 hover-lift">
                Create Account
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
