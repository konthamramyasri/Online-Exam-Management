import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import * as api from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { StatCard } from '../../components/AppShell';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Feedback';
import { EmptyState } from '../../components/ui/EmptyState';
import { examStatus, formatDate } from '../../lib/utils';

export function StudentOverview() {
  const { profile } = useAuth();
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [examsData, resultsData] = await Promise.all([api.getExams(), api.getResults()]);
        setExams(examsData ?? []);
        setResults((resultsData ?? []).filter((r) => r.studentId === profile.id));
      } catch {
        // Keep empty lists on failure; the page still renders.
      }
      setLoading(false);
    }
    if (profile) load();
  }, [profile]);

  const activeExams = exams.filter((e) => examStatus(e) === 'active');
  const passedCount = results.filter((r) => r.passed).length;
  const avgScore = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;

  return (
    <div className="space-y-6">
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
            <StatCard label="Active exams" value={activeExams.length} icon={<Clock size={18} />} tone="brand" />
            <StatCard label="Exams taken" value={results.length} icon={<FileText size={18} />} tone="accent" />
            <StatCard label="Exams passed" value={passedCount} icon={<CheckCircle2 size={18} />} tone="success" />
            <StatCard label="Avg. score" value={`${avgScore}%`} icon={<TrendingUp size={18} />} tone="warning" />
          </>
        )}
      </div>

      {/* Active exams */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Active exams</h2>
          <Link to="/student/exams" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Browse all
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : activeExams.length === 0 ? (
          <EmptyState
            icon={<FileText size={26} />}
            title="No active exams right now"
            description="Check back later or browse all available exams."
            action={<Link to="/student/exams" className="btn-secondary">Browse exams</Link>}
          />
        ) : (
          <div className="space-y-2">
            {activeExams.slice(0, 4).map((exam) => (
              <Link
                key={exam.examId}
                to={`/student/exams/${exam.examId}`}
                className="group flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3 transition hover:border-brand-200 hover:bg-brand-50/30"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-800">{exam.title}</p>
                  <p className="text-xs text-ink-400">
                    {exam.durationMinutes} min · {exam.totalMarks} marks · ends {formatDate(exam.endDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="success">Active</Badge>
                  <ArrowRight size={16} className="text-brand-600 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent results */}
      {results.length > 0 && (
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">Recent results</h2>
          <div className="space-y-2">
            {results.slice(0, 5).map((r) => {
              const exam = exams.find((e) => e.examId === r.examId);
              return (
                <div
                  key={r.resultId}
                  className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-ink-800">{r.examTitle ?? exam?.title ?? 'Unknown exam'}</p>
                    <p className="text-xs text-ink-400">{formatDate(r.submissionDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums text-ink-700">
                      {r.marksObtained}/{exam?.totalMarks ?? '—'} · {Number(r.percentage).toFixed(0)}%
                    </span>
                    <Badge tone={r.passed ? 'success' : 'danger'}>
                      {r.passed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
