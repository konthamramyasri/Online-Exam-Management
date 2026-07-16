import { Link } from 'react-router-dom';
import { ShieldCheck, GraduationCap, Clock, CheckCircle2, BarChart3, ArrowRight, FileQuestion } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen surface">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <FileQuestion size={20} />
          </div>
          <span className="text-lg font-bold text-ink-900">ExamForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">Sign in</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-slide-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Online examination platform
            </div>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] text-ink-950 sm:text-5xl lg:text-6xl">
              Build exams.
              <br />
              <span className="text-brand-600">Grade instantly.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-600">
              A complete examination system for administrators and students.
              Create timed multiple-choice exams, track results, and let students
              take exams within controlled date windows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary btn-lg">
                Create an account
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary btn-lg">
                Sign in
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-ink-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success-500" />
                Free to use
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success-500" />
                No setup required
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-scale-in">
            <div className="card overflow-hidden p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-ink-400">Sample Exam</p>
                  <p className="text-lg font-bold text-ink-900">JavaScript Fundamentals</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-700">
                  <Clock size={14} />
                  14:32
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-ink-100 p-4">
                  <p className="text-sm font-medium text-ink-800">What is the output of <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-xs">typeof null</code>?</p>
                  <div className="mt-3 space-y-2">
                    {['"null"', '"object"', '"undefined"', '"number"'].map((opt, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm ${
                          i === 1
                            ? 'border-brand-300 bg-brand-50 text-brand-800'
                            : 'border-ink-100 text-ink-600'
                        }`}
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                        {i === 1 && <CheckCircle2 size={15} className="ml-auto text-brand-600" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3">
                  <span className="text-sm text-ink-500">Question 3 of 10</span>
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-ink-200">
                    <div className="h-full w-[30%] rounded-full bg-brand-500" />
                  </div>
                </div>
              </div>
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-card-hover ring-1 ring-ink-100 sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="text-xs text-ink-400">Pass rate</p>
                  <p className="text-lg font-bold text-ink-900">87%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role cards */}
      <section className="border-t border-ink-100 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-ink-900 sm:text-3xl">
            Two roles, one platform
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-ink-500">
            Choose your role and get the tools you need.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <RoleCard
              to="/register?role=admin"
              icon={<ShieldCheck size={24} />}
              tone="brand"
              title="For Administrators"
              description="Create exams, add multiple-choice questions, and monitor student performance with a full gradebook."
              points={['Exam creator with date windows', 'Question bank management', 'Results gradebook for all students']}
            />
            <RoleCard
              to="/register?role=student"
              icon={<GraduationCap size={24} />}
              tone="accent"
              title="For Students"
              description="Browse available exams, take timed tests with a live countdown, and view your results history."
              points={['Browse active exams', 'Timed exam engine with auto-submit', 'Personal results dashboard']}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function RoleCard({ to, icon, title, description, points, tone }) {
  const toneClass = tone === 'brand' ? 'bg-brand-600' : 'bg-accent-500';
  return (
    <Link
      to={to}
      className="card card-hover group block p-7 transition-transform hover:-translate-y-0.5"
    >
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass} text-white shadow-sm`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">{description}</p>
      <ul className="mt-5 space-y-2.5">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2.5 text-sm text-ink-700">
            <CheckCircle2 size={16} className="shrink-0 text-success-500" />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all">
        Get started
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}
