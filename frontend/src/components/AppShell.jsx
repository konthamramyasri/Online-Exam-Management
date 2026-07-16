import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, GraduationCap, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function AppShell({ children, navItems, title, subtitle }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="min-h-screen surface">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink-100/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                {isAdmin ? <ShieldCheck size={20} /> : <GraduationCap size={20} />}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold leading-tight text-ink-900">ExamForge</p>
                <p className="text-[11px] leading-tight text-ink-400">
                  {isAdmin ? 'Admin Console' : 'Student Portal'}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink-800">{profile?.full_name}</p>
              <p className="text-[11px] capitalize text-ink-400">{profile?.role}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {profile?.full_name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleSignOut}
              className="btn-ghost px-2.5"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className={`${mobileOpen ? 'block' : 'hidden'} lg:block`}>
          <nav className="sticky top-24 w-56 shrink-0 space-y-1">
            {navItems.map((item) => (
              <NavItemLink key={item.to} {...item} onClick={() => setMobileOpen(false)} />
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
          </div>
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

function NavItemLink({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
          isActive
            ? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100'
            : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </NavLink>
  );
}

export function StatCard({ label, value, icon, tone = 'brand' }) {
  const toneBg = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    accent: 'bg-accent-50 text-accent-600',
  };
  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneBg[tone]}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-ink-900">{value}</p>
    </div>
  );
}

export { ClipboardCheck };
