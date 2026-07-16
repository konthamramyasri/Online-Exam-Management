import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, GraduationCap, FileQuestion, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { validateEmail, validateName, validatePassword } from '../lib/utils';

export function AuthPage({ mode, role }) {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const isRegister = mode === 'register';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    if (isRegister) nextErrors.name = validateName(fullName);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    const result = isRegister
      ? await signUp(email, password, fullName.trim(), role)
      : await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }
    navigate(role === 'admin' ? '/admin' : '/student');
  }

  const accent = role === 'admin' ? 'brand' : 'accent';
  const accentBg = accent === 'brand' ? 'bg-brand-600' : 'bg-accent-500';

  return (
    <div className="min-h-screen surface flex">
      {/* Left panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-ink-950 p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <FileQuestion size={20} />
          </div>
          <span className="text-lg font-bold">ExamForge</span>
        </Link>
        <div>
          <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${accentBg} text-white shadow-lg`}>
            {role === 'admin' ? <ShieldCheck size={28} /> : <GraduationCap size={28} />}
          </div>
          <h2 className="text-balance text-3xl font-bold text-white">
            {role === 'admin'
              ? 'Manage exams with precision'
              : 'Take exams with confidence'}
          </h2>
          <p className="mt-3 max-w-md text-ink-400">
            {role === 'admin'
              ? 'Create exams, build question banks, and track every student result from one dashboard.'
              : 'Browse available exams, take them within active date windows, and get instant graded results.'}
          </p>
        </div>
        <p className="text-sm text-ink-500">
          © {new Date().getFullYear()} ExamForge. All rights reserved.
        </p>
      </div>

      {/* Right form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800">
            <ArrowLeft size={16} /> Back home
          </Link>

          <div className="lg:hidden">
            <RolePill role={role} />
          </div>

          <h1 className="mt-2 text-2xl font-bold text-ink-900">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            {isRegister
              ? `Sign up as a ${role} to get started.`
              : `Sign in to your ${role} account.`}
          </p>

          {/* Role switcher */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-ink-100 p-1">
            <RoleTab active={role === 'admin'} to={mode === 'login' ? '/login?role=admin' : '/register?role=admin'} label="Admin" icon={<ShieldCheck size={15} />} />
            <RoleTab active={role === 'student'} to={mode === 'login' ? '/login?role=student' : '/register?role=student'} label="Student" icon={<GraduationCap size={15} />} />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {isRegister && (
              <Input
                label="Full name"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.name}
              />
            )}
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder={isRegister ? '6–20 characters' : 'Your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              hint={isRegister && !errors.password ? 'Between 6 and 20 characters' : undefined}
            />

            {formError && (
              <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
                {formError}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {isRegister ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <Link to={`/login?role=${role}`} className="font-semibold text-brand-600 hover:text-brand-700">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to={`/register?role=${role}`} className="font-semibold text-brand-600 hover:text-brand-700">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleTab({ active, to, label, icon }) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function RolePill({ role }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">
      {role === 'admin' ? <ShieldCheck size={14} /> : <GraduationCap size={14} />}
      {role === 'admin' ? 'Administrator' : 'Student'}
    </div>
  );
}
