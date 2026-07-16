import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Pencil, FileText, CheckCircle2 } from 'lucide-react';
import * as api from '../../lib/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Feedback';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { ExamFormModal } from '../../components/ExamFormModal';
import { QuestionFormModal, DeleteQuestionButton } from '../../components/QuestionFormModal';
import { examStatus, formatDate } from '../../lib/utils';

export function AdminExamDetail() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editExamOpen, setEditExamOpen] = useState(false);

  const load = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    try {
      const [examData, qData] = await Promise.all([
        api.getExam(examId),
        api.getQuestionsForExam(examId),
      ]);
      setExam(examData);
      setQuestions(qData ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load');
    }
    setLoading(false);
  }, [examId]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="space-y-4">
        <Link to="/admin/exams" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800">
          <ArrowLeft size={16} /> Back to exams
        </Link>
        <ErrorState message={error || 'Exam not found'} />
      </div>
    );
  }

  const status = examStatus(exam);
  const tone = status === 'active' ? 'success' : status === 'upcoming' ? 'warning' : 'neutral';
  const computedTotal = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="space-y-6">
      <Link to="/admin/exams" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft size={16} /> Back to exams
      </Link>

      {/* Exam header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone={tone}>{status}</Badge>
              <span className="text-xs text-ink-400">
                {formatDate(exam.startDate)} — {formatDate(exam.endDate)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-ink-900">{exam.title}</h2>
            {exam.description && <p className="mt-1 text-sm text-ink-500">{exam.description}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Spec label="Duration" value={`${exam.durationMinutes} min`} />
              <Spec label="Total marks" value={exam.totalMarks} />
              <Spec label="Pass marks" value={exam.passMarks} />
              <Spec label="Questions" value={questions.length} />
              {computedTotal !== exam.totalMarks && questions.length > 0 && (
                <span className="rounded-lg bg-warning-50 px-2.5 py-1 text-xs font-medium text-warning-700">
                  Question marks sum: {computedTotal}
                </span>
              )}
            </div>
          </div>
          <Button variant="secondary" onClick={() => setEditExamOpen(true)}>
            <Pencil size={16} /> Edit exam
          </Button>
        </div>
      </div>

      {/* Questions */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink-900">Questions</h3>
            <p className="text-sm text-ink-400">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
          </div>
          <Button onClick={() => setQuestionModalOpen(true)}>
            <Plus size={18} /> Add question
          </Button>
        </div>

        {questions.length === 0 ? (
          <EmptyState
            icon={<FileText size={26} />}
            title="No questions yet"
            description="Add multiple-choice questions to this exam."
            action={<Button onClick={() => setQuestionModalOpen(true)}><Plus size={18} /> Add question</Button>}
          />
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.questionId} className="rounded-xl border border-ink-100 p-4 transition hover:border-ink-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-600">
                        {idx + 1}
                      </span>
                      <Badge tone="neutral">{q.marks} mark{q.marks !== 1 ? 's' : ''}</Badge>
                    </div>
                    <p className="font-medium text-ink-800">{q.questionText}</p>
                    <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {['A', 'B', 'C', 'D'].map((opt) => {
                        const val = q[`option${opt}`];
                        const isCorrect = q.correctAnswer === opt;
                        return (
                          <div
                            key={opt}
                            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                              isCorrect ? 'bg-success-50 text-success-700 ring-1 ring-inset ring-success-200' : 'bg-ink-50 text-ink-600'
                            }`}
                          >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold">
                              {opt}
                            </span>
                            <span className="truncate">{val}</span>
                            {isCorrect && <CheckCircle2 size={14} className="ml-auto shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <DeleteQuestionButton question={q} onDeleted={load} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ExamFormModal open={editExamOpen} onClose={() => setEditExamOpen(false)} onSaved={load} exam={exam} />
      <QuestionFormModal open={questionModalOpen} onClose={() => setQuestionModalOpen(false)} onSaved={load} examId={exam.examId} />
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-lg bg-ink-50 px-3 py-1.5">
      <span className="text-[10px] uppercase tracking-wide text-ink-400">{label}: </span>
      <span className="text-sm font-semibold text-ink-800">{value}</span>
    </div>
  );
}
