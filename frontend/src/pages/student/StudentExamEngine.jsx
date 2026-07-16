import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock, AlertTriangle, ChevronLeft, ChevronRight, Flag, ArrowLeft,
  CheckCircle2, XCircle, Award, TrendingUp,
} from 'lucide-react';
import * as api from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Feedback';
import { ErrorState } from '../../components/ui/EmptyState';
import { examStatus, formatTime, formatDate } from '../../lib/utils';
import { gradeExamPreview, persistResult, saveAnswer } from '../../lib/grading';

const OPTIONS = ['A', 'B', 'C', 'D'];

export function StudentExamEngine() {
  const { examId } = useParams();
  const { profile } = useAuth();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [graded, setGraded] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const timerRef = useRef(null);

  // Load exam + questions + any existing answers
  useEffect(() => {
    async function load() {
      if (!examId || !profile) return;
      setLoading(true);
      try {
        const [examData, qData, ansData] = await Promise.all([
          api.getExam(examId),
          api.getQuestionsForExam(examId),
          api.getStudentAnswers(),
        ]);
        setExam(examData);
        setQuestions(qData ?? []);
        const existing = {};
        (ansData ?? [])
          .filter((a) => a.studentId === profile.id)
          .forEach((a) => {
            existing[a.questionId] = a.selectedAnswer;
          });
        setAnswers(existing);
      } catch (err) {
        setError(err.message || 'Failed to load exam');
      }
      setLoading(false);
    }
    load();
  }, [examId, profile]);

  // Start timer
  function handleStart() {
    if (!exam) return;
    setSecondsLeft(exam.durationMinutes * 60);
    setStarted(true);
  }

  // Countdown timer with auto-submit
  useEffect(() => {
    if (!started || graded) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, graded]);

  // Record answer immediately and save to backend
  const handleSelect = useCallback(
    async (questionId, option) => {
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
      if (profile) {
        await saveAnswer(profile.id, questionId, option);
      }
    },
    [profile],
  );

  // Submit & grade
  async function handleSubmit(auto = false) {
    if (!exam || !profile || submitting) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    setConfirmSubmit(false);

    const preview = gradeExamPreview(questions, answers);
    const { result, error: persistError } = await persistResult(profile.id, exam.examId);
    if (persistError) {
      setError(`Failed to save result: ${persistError}`);
      setSubmitting(false);
      return;
    }

    setGraded({
      marksObtained: result.marksObtained,
      totalMarks: exam.totalMarks,
      percentage: result.percentage,
      passed: result.passed,
      correctCount: preview.correctCount,
      totalQuestions: preview.totalQuestions,
    });
    setSubmitting(false);
  }

  // --- Render states ---

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
        <Link to="/student/exams" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800">
          <ArrowLeft size={16} /> Back to exams
        </Link>
        <ErrorState message={error || 'Exam not found'} />
      </div>
    );
  }

  // Result screen
  if (graded) {
    return <ResultScreen exam={exam} graded={graded} />;
  }

  // Pre-start screen
  if (!started) {
    const status = examStatus(exam);
    if (status !== 'active') {
      return (
        <div className="space-y-4">
          <Link to="/student/exams" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800">
            <ArrowLeft size={16} /> Back to exams
          </Link>
          <div className="card p-8 text-center">
            <AlertTriangle size={32} className="mx-auto text-warning-500" />
            <h2 className="mt-4 text-xl font-bold text-ink-900">Exam not available</h2>
            <p className="mt-2 text-sm text-ink-500">
              {status === 'upcoming'
                ? `This exam opens on ${formatDate(exam.startDate)}.`
                : `This exam ended on ${formatDate(exam.endDate)}.`}
            </p>
            <Link to="/student/exams" className="btn-secondary mt-6">Back to exams</Link>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link to="/student/exams" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800">
          <ArrowLeft size={16} /> Back to exams
        </Link>
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-ink-900">{exam.title}</h2>
          {exam.description && <p className="mt-2 text-ink-500">{exam.description}</p>}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoBox label="Questions" value={questions.length} />
            <InfoBox label="Duration" value={`${exam.durationMinutes} min`} />
            <InfoBox label="Total marks" value={exam.totalMarks} />
            <InfoBox label="Pass marks" value={exam.passMarks} />
          </div>
          <div className="mt-6 rounded-xl bg-warning-50 px-4 py-3 text-sm text-warning-700 ring-1 ring-inset ring-warning-200">
            <AlertTriangle size={16} className="mb-1 inline" /> Once you start, the timer will count down from {exam.durationMinutes} minutes. The exam auto-submits when time runs out.
          </div>
          {questions.length === 0 ? (
            <div className="mt-6 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-500">
              This exam has no questions yet.
            </div>
          ) : (
            <Button onClick={handleStart} size="lg" className="mt-6 w-full">
              Start exam
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Active exam screen
  const currentQ = questions[currentIdx];
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const timeLow = secondsLeft <= 30;

  return (
    <div className="space-y-4">
      {/* Top bar: timer + progress */}
      <div className="sticky top-16 z-30 rounded-2xl bg-white/90 px-5 py-3 shadow-card ring-1 ring-ink-100 backdrop-blur-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">{exam.title}</p>
            <p className="text-xs text-ink-400">
              {answeredCount} of {questions.length} answered
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-lg font-bold tabular-nums transition ${
              timeLow ? 'bg-danger-50 text-danger-700 animate-pulse' : 'bg-ink-100 text-ink-700'
            }`}>
              <Clock size={18} />
              {formatTime(secondsLeft)}
            </div>
            <Button variant="danger" onClick={() => setConfirmSubmit(true)} disabled={submitting}>
              <Flag size={16} /> Submit
            </Button>
          </div>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="card p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <Badge tone="brand">Question {currentIdx + 1} of {questions.length}</Badge>
          <Badge tone="neutral">{currentQ.marks} mark{currentQ.marks !== 1 ? 's' : ''}</Badge>
        </div>
        <h2 className="text-lg font-semibold leading-relaxed text-ink-900">
          {currentQ.questionText}
        </h2>
        <div className="mt-6 space-y-2.5">
          {OPTIONS.map((opt) => {
            const val = currentQ[`option${opt}`];
            const selected = answers[currentQ.questionId] === opt;
            return (
              <button
                key={opt}
                onClick={() => handleSelect(currentQ.questionId, opt)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition ${
                  selected
                    ? 'border-brand-500 bg-brand-50 text-ink-900 shadow-sm'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-ink-50'
                }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                  selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-300 text-ink-500'
                }`}>
                  {opt}
                </span>
                <span className="text-sm font-medium">{val}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
          >
            <ChevronLeft size={18} /> Previous
          </Button>
          {currentIdx < questions.length - 1 ? (
            <Button onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}>
              Next <ChevronRight size={18} />
            </Button>
          ) : (
            <Button variant="danger" onClick={() => setConfirmSubmit(true)}>
              <Flag size={16} /> Submit exam
            </Button>
          )}
        </div>
      </div>

      {/* Question palette */}
      <div className="card p-5">
        <p className="mb-3 text-sm font-semibold text-ink-700">Question palette</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.questionId];
            const isCurrent = i === currentIdx;
            return (
              <button
                key={q.questionId}
                onClick={() => setCurrentIdx(i)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                  isCurrent
                    ? 'ring-2 ring-brand-500 ring-offset-1'
                    : ''
                } ${
                  isAnswered
                    ? 'bg-success-100 text-success-700'
                    : 'bg-ink-100 text-ink-500 hover:bg-ink-200'
                }`}
                title={isAnswered ? 'Answered' : 'Not answered'}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-ink-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-success-100" /> Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-ink-100" /> Unanswered
          </span>
        </div>
      </div>

      {/* Submit confirmation */}
      <Modal
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        title="Submit exam?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmSubmit(false)}>Keep going</Button>
            <Button variant="danger" onClick={() => handleSubmit(false)} loading={submitting}>
              Submit now
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          You've answered <span className="font-bold text-ink-900">{answeredCount}</span> of{' '}
          <span className="font-bold text-ink-900">{questions.length}</span> questions.
          {answeredCount < questions.length && (
            <span className="mt-2 block text-warning-600">
              {questions.length - answeredCount} question{questions.length - answeredCount !== 1 ? 's' : ''} unanswered — unanswered questions score 0.
            </span>
          )}
        </p>
      </Modal>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-ink-50 px-4 py-3 text-center">
      <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink-900">{value}</p>
    </div>
  );
}

function ResultScreen({ exam, graded }) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card overflow-hidden p-0 text-center">
        {/* Header */}
        <div className={`px-6 py-10 ${graded.passed ? 'bg-success-50' : 'bg-danger-50'}`}>
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
            graded.passed ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
          }`}>
            {graded.passed ? <Award size={40} /> : <XCircle size={40} />}
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-ink-900">
            {graded.passed ? 'Passed!' : 'Failed'}
          </h2>
          <p className="mt-1 text-sm text-ink-500">{exam.title}</p>
        </div>

        {/* Score */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ScoreStat label="Score" value={`${graded.marksObtained}/${graded.totalMarks}`} />
            <ScoreStat label="Percentage" value={`${Number(graded.percentage).toFixed(1)}%`} />
            <ScoreStat label="Correct" value={`${graded.correctCount}/${graded.totalQuestions}`} />
            <ScoreStat label="Pass marks" value={exam.passMarks} />
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-ink-400">
              <span>Your score</span>
              <span>Pass mark: {exam.passMarks}</span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-ink-100">
              <div
                className={`h-full rounded-full ${graded.passed ? 'bg-success-500' : 'bg-danger-500'}`}
                style={{ width: `${Math.min(graded.percentage, 100)}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-ink-700"
                style={{ left: `${Math.min((exam.passMarks / exam.totalMarks) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="secondary" onClick={() => navigate('/student/results')}>
              <TrendingUp size={18} /> View all results
            </Button>
            <Button onClick={() => navigate('/student/exams')}>
              <CheckCircle2 size={18} /> Back to exams
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreStat({ label, value }) {
  return (
    <div className="rounded-xl bg-ink-50 px-3 py-4">
      <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink-900">{value}</p>
    </div>
  );
}
