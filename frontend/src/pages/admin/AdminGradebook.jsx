import { useEffect, useState } from 'react';
import { BarChart3, Search } from 'lucide-react';
import * as api from '../../lib/api';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Feedback';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { formatDate } from '../../lib/utils';

export function AdminGradebook() {
  const [results, setResults] = useState([]);
  const [examsById, setExamsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [resultsData, examsData] = await Promise.all([api.getResults(), api.getExams()]);
        const sorted = [...(resultsData ?? [])].sort((a, b) => b.resultId - a.resultId);
        setResults(sorted);
        setExamsById(Object.fromEntries((examsData ?? []).map((e) => [e.examId, e])));
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = results.filter((r) => {
    if (filter === 'pass' && !r.passed) return false;
    if (filter === 'fail' && r.passed) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.studentName?.toLowerCase().includes(q) ||
        r.examTitle?.toLowerCase().includes(q)
      );
    }
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
            placeholder="Search by student or exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 rounded-xl bg-ink-100 p-1">
          {['all', 'pass', 'fail'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition ${
                filter === f ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'pass' ? 'Passed' : 'Failed'}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} />}

      {loading ? (
        <div className="card overflow-hidden">
          <div className="space-y-0">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-none border-b border-ink-100" />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={26} />}
          title="No results yet"
          description="Student results will appear here after they submit exams."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50 text-left">
                  <th className="px-4 py-3 font-semibold text-ink-600">Student</th>
                  <th className="px-4 py-3 font-semibold text-ink-600">Exam</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink-600">Score</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink-600">Percentage</th>
                  <th className="px-4 py-3 text-center font-semibold text-ink-600">Result</th>
                  <th className="px-4 py-3 font-semibold text-ink-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((r) => {
                  const exam = examsById[r.examId];
                  return (
                    <tr key={r.resultId} className="transition hover:bg-ink-50/50">
                      <td className="px-4 py-3 font-medium text-ink-800">
                        {r.studentName ?? 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-ink-600">{r.examTitle ?? 'Unknown'}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink-700">
                        {r.marksObtained} / {exam?.totalMarks ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink-700">
                        {Number(r.percentage).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge tone={r.passed ? 'success' : 'danger'}>
                          {r.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-ink-400">{formatDate(r.submissionDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
