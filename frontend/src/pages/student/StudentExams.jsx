import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Calendar, Search } from 'lucide-react';
import * as api from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Feedback';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { examStatus, formatDate } from '../../lib/utils';

export function StudentExams() {
  const { profile } = useAuth();
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [examsData, resultsData] = await Promise.all([api.getExams(), api.getResults()]);
      setExams(examsData ?? []);
      setResults((resultsData ?? []).filter((r) => r.studentId === profile.id));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [profile]);

  useEffect(() => { if (profile) load(); }, [profile, load]);

  const filtered = exams.filter((e) => {
    const status = examStatus(e);
    if (filter !== 'all' && status !== filter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-10"
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 rounded-xl bg-ink-100 p-1">
          {['all', 'active', 'upcoming', 'expired'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition ${
                filter === f ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FileText size={26} />}
          title="No exams found"
          description={search ? "Try a different search term." : "There are no exams matching this filter."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exam) => {
            const status = examStatus(exam);
            const tone = status === 'active' ? 'success' : status === 'upcoming' ? 'warning' : 'neutral';
            const result = results.find((r) => r.examId === exam.examId);
            const canTake = status === 'active' && !result;

            return (
              <div key={exam.examId} className="card card-hover flex flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Badge tone={tone}>{status}</Badge>
                  {result && (
                    <Badge tone={result.passed ? 'success' : 'danger'}>
                      {result.passed ? 'Passed' : 'Failed'}
                    </Badge>
                  )}
                </div>
                <h3 className="text-base font-bold text-ink-900">{exam.title}</h3>
                {exam.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink-500">{exam.description}</p>
                )}
                <div className="mt-4 space-y-1.5 text-xs text-ink-500">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-ink-400" />
                    {exam.durationMinutes} minutes
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-ink-400" />
                    {formatDate(exam.startDate)} — {formatDate(exam.endDate)}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
                  <span className="text-sm font-semibold text-ink-700">
                    {exam.totalMarks} marks · pass: {exam.passMarks}
                  </span>
                  {result ? (
                    <span className="text-sm font-medium text-ink-400">
                      Score: {Number(result.percentage).toFixed(0)}%
                    </span>
                  ) : canTake ? (
                    <Link to={`/student/exams/${exam.examId}`} className="btn-primary text-xs">
                      Start exam
                    </Link>
                  ) : status === 'upcoming' ? (
                    <span className="text-xs font-medium text-warning-600">Not yet open</span>
                  ) : (
                    <span className="text-xs font-medium text-ink-400">Expired</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
