import { Outlet, useLocation } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LayoutDashboard, FileText, BarChart3 } from 'lucide-react';

const navItems = [
  { to: '/student', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { to: '/student/exams', label: 'Exams', icon: <FileText size={18} /> },
  { to: '/student/results', label: 'My Results', icon: <BarChart3 size={18} /> },
];

const titles = {
  '/student': { title: 'Student dashboard', subtitle: 'View your available exams and recent results.' },
  '/student/exams': { title: 'Available exams', subtitle: 'Browse and take exams that are currently active.' },
  '/student/results': { title: 'My results', subtitle: 'Review your exam history and performance.' },
};

export function StudentLayout({ children }) {
  const location = useLocation();
  const meta = titles[location.pathname] ?? { title: 'Student', subtitle: '' };

  return (
    <AppShell navItems={navItems} title={meta.title} subtitle={meta.subtitle}>
      {children ?? <Outlet />}
    </AppShell>
  );
}
