export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function examStatus(exam) {
  const today = todayISO();
  if (today < exam.startDate) return 'upcoming';
  if (today > exam.endDate) return 'expired';
  return 'active';
}

export function formatDate(iso) {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function cls(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 20) return 'Password must be at most 20 characters';
  return null;
}

export function validateName(name) {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
}
