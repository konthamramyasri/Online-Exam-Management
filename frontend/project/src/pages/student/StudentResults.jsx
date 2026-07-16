import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Award, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Feedback';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { formatDate } from '../../lib/utils';

export function StudentResults() {
  const { profile } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!profile) return;
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('results')
        .select('*, exam:exams(id, title, total_marks, pass_marks)')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setResults(data ?? []);
      setLoading(false);
    }
    if (profile) load();
  }, [profile]);

  const passed = results.filter((r) => r.passed).length;
  const avgScore = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;
  const bestScore = results.length
    ? Math.max(...results.map((r) => r.percentage))
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      {results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox label="Exams taken" value={results.length} icon={<BarChart3 size={18} />} tone="brand" />
          <StatBox label="Passed" value={passed} icon={<CheckCircle2 size={18} />} tone="success" />
          <StatBox label="Average" value={`${avgScore}%`} icon={<TrendingUp size={18} />} tone="accent" />
          <StatBox label="Best score" value={`${bestScore.toFixed(0)}%`} icon={<Award size={18} />} tone="warning" />
        </div>
      )}

      {error && <ErrorState message={error} />}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={26} />}
          title="No results yet"
          description="Take an exam to see your results here."
          action={<Link to="/student/exams" className="btn-primary">Browse exams</Link>}
        />
      ) : (
        <div className="space-y-3">
          {results.map((r) => (
            <div key={r.id} className="card card-hover p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge tone={r.passed ? 'success' : 'danger'}>
                      {r.passed ? (
                        <><CheckCircle2 size={12} /> Passed</>
                      ) : (
                        <><XCircle size={12} /> Failed</>
                      )}
                    </Badge>
                    <span className="text-xs text-ink-400">{formatDate(r.submission_date)}</span>
                  </div>
                  <h3 className="text-base font-bold text-ink-900">{r.exam?.title ?? 'Unknown exam'}</h3>
                  <p className="mt-1 text-sm text-ink-500">
                    Pass mark: {r.exam?.pass_marks} · You scored {r.marks_obtained} out of {r.total_marks}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-extrabold ${r.passed ? 'text-success-600' : 'text-danger-600'}`}>
                    {Number(r.percentage).toFixed(1)}%
                  </p>
                  <p className="text-xs text-ink-400">
                    {r.marks_obtained}/{r.total_marks} marks
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className={`h-full rounded-full ${r.passed ? 'bg-success-500' : 'bg-danger-500'}`}
                    style={{ width: `${Math.min(Number(r.percentage), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, icon, tone }) {
  const toneBg = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
    accent: 'bg-accent-50 text-accent-600',
    warning: 'bg-warning-50 text-warning-600',
  };
  return (
    <div className="card p-5">
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
