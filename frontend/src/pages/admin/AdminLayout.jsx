import { Outlet, useLocation } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LayoutDashboard, FileText, ClipboardList, BarChart3 } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/exams', label: 'Exams', icon: <FileText size={18} /> },
  { to: '/admin/questions', label: 'Questions', icon: <ClipboardList size={18} /> },
  { to: '/admin/gradebook', label: 'Gradebook', icon: <BarChart3 size={18} /> },
];

const titles = {
  '/admin': { title: 'Dashboard overview', subtitle: 'Monitor your exams and student performance at a glance.' },
  '/admin/exams': { title: 'Manage exams', subtitle: 'Create, edit, and manage exam definitions.' },
  '/admin/questions': { title: 'Question bank', subtitle: 'Add and manage multiple-choice questions for each exam.' },
  '/admin/gradebook': { title: 'Gradebook', subtitle: 'View all student results across every exam.' },
};

export function AdminLayout({ children }) {
  const location = useLocation();
  const meta = titles[location.pathname] ?? { title: 'Admin', subtitle: '' };

  return (
    <AppShell navItems={navItems} title={meta.title} subtitle={meta.subtitle}>
      {children ?? <Outlet />}
    </AppShell>
  );
}
