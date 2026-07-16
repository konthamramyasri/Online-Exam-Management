import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ClipboardList, Users, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { StatCard } from '../../components/AppShell';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Feedback';
import { EmptyState } from '../../components/ui/EmptyState';
import { examStatus, formatDate } from '../../lib/utils';

export function AdminOverview() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: examsData }, { data: resultsData }, { count }] = await Promise.all([
        supabase.from('exams').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('results').select('*'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      ]);
      setExams(examsData ?? []);
      setResults(resultsData ?? []);
      setStudentCount(count ?? 0);
      setLoading(false);
    }
    load();
  }, []);

  const passRate = results.length
    ? Math.round((results.filter((r) => r.passed).length / results.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <StatCard label="Total exams" value={exams.length} icon={<FileText size={18} />} tone="brand" />
            <StatCard label="Total questions" value={results.length} icon={<ClipboardList size={18} />} tone="accent" />
            <StatCard label="Students enrolled" value={studentCount} icon={<Users size={18} />} tone="success" />
            <StatCard label="Pass rate" value={`${passRate}%`} icon={<CheckCircle2 size={18} />} tone="warning" />
          </>
        )}
      </div>

      {/* Recent exams */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Recent exams</h2>
          <Link to="/admin/exams" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : exams.length === 0 ? (
          <EmptyState
            icon={<FileText size={26} />}
            title="No exams yet"
            description="Create your first exam to get started."
            action={<Link to="/admin/exams" className="btn-primary">Create exam</Link>}
          />
        ) : (
          <div className="space-y-2">
            {exams.map((exam) => {
              const status = examStatus(exam);
              const tone = status === 'active' ? 'success' : status === 'upcoming' ? 'warning' : 'neutral';
              return (
                <Link
                  key={exam.id}
                  to={`/admin/exams/${exam.id}`}
                  className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3 transition hover:border-brand-200 hover:bg-brand-50/30"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-800">{exam.title}</p>
                    <p className="text-xs text-ink-400">
                      {formatDate(exam.start_date)} — {formatDate(exam.end_date)}
                    </p>
                  </div>
                  <Badge tone={tone}>{status}</Badge>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
