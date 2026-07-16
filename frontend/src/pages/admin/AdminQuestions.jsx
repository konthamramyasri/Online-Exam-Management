import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight } from 'lucide-react';
import * as api from '../../lib/api';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Feedback';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { examStatus, formatDate } from '../../lib/utils';

export function AdminQuestions() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const examsData = await api.getExams();
      const withCounts = await Promise.all(
        (examsData ?? []).map(async (exam) => {
          try {
            const questions = await api.getQuestionsForExam(exam.examId);
            return { ...exam, question_count: questions.length };
          } catch {
            return { ...exam, question_count: 0 };
          }
        }),
      );
      withCounts.sort((a, b) => b.examId - a.examId);
      setExams(withCounts);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : exams.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={26} />}
          title="No exams to manage"
          description="Create an exam first, then add questions to it."
          action={<Link to="/admin/exams" className="btn-primary">Go to exams</Link>}
        />
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => {
            const status = examStatus(exam);
            const tone = status === 'active' ? 'success' : status === 'upcoming' ? 'warning' : 'neutral';
            return (
              <Link
                key={exam.examId}
                to={`/admin/exams/${exam.examId}`}
                className="card card-hover group flex items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge tone={tone}>{status}</Badge>
                    <span className="text-xs text-ink-400">
                      {formatDate(exam.startDate)} — {formatDate(exam.endDate)}
                    </span>
                  </div>
                  <h3 className="font-bold text-ink-900">{exam.title}</h3>
                  <p className="mt-1 text-sm text-ink-500">
                    {exam.question_count} question{exam.question_count !== 1 ? 's' : ''} · {exam.durationMinutes} min · {exam.totalMarks} marks
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition group-hover:gap-2.5">
                  Manage
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
