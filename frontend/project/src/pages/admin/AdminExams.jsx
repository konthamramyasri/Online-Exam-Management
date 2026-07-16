import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Pencil, Trash2, ClipboardList } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Feedback';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/EmptyState';
import { ExamFormModal } from '../../components/ExamFormModal';
import { examStatus, formatDate } from '../../lib/utils';

export function AdminExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editExam, setEditExam] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setExams(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id) {
    if (!confirm('Delete this exam and all its questions? This cannot be undone.')) return;
    await supabase.from('exams').delete().eq('id', id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => { setEditExam(null); setModalOpen(true); }}>
          <Plus size={18} /> New exam
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      ) : exams.length === 0 ? (
        <EmptyState
          icon={<FileText size={26} />}
          title="No exams created"
          description="Create your first exam to start adding questions."
          action={<Button onClick={() => setModalOpen(true)}><Plus size={18} /> New exam</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const status = examStatus(exam);
            const tone = status === 'active' ? 'success' : status === 'upcoming' ? 'warning' : 'neutral';
            return (
              <div key={exam.id} className="card card-hover group flex flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <Badge tone={tone}>{status}</Badge>
                  <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => { setEditExam(exam); setModalOpen(true); }}
                      className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="rounded-lg p-1.5 text-ink-400 hover:bg-danger-50 hover:text-danger-600"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-bold text-ink-900">{exam.title}</h3>
                {exam.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink-500">{exam.description}</p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <Spec label="Duration" value={`${exam.duration_minutes} min`} />
                  <Spec label="Total marks" value={exam.total_marks} />
                  <Spec label="Pass marks" value={exam.pass_marks} />
                  <Spec label="Questions" value="—" />
                </div>
                <div className="mt-4 border-t border-ink-100 pt-3">
                  <p className="text-xs text-ink-400">
                    {formatDate(exam.start_date)} — {formatDate(exam.end_date)}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/admin/exams/${exam.id}`} className="btn-secondary flex-1 text-xs">
                    <ClipboardList size={14} /> Manage
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ExamFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        exam={editExam}
      />
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-lg bg-ink-50 px-2.5 py-1.5">
      <p className="text-[10px] uppercase tracking-wide text-ink-400">{label}</p>
      <p className="text-sm font-semibold text-ink-800">{value}</p>
    </div>
  );
}
