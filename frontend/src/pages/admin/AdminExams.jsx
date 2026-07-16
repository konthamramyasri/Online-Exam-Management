import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Pencil, Trash2, ClipboardList } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Feedback";
import { EmptyState, ErrorState } from "../../components/ui/EmptyState";
import { ExamFormModal } from "../../components/ExamFormModal";
import * as api from "../../lib/api";
import { examStatus, formatDate } from "../../lib/utils";

export function AdminExams() {

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editExam, setEditExam] = useState(null);

    const load = useCallback(async () => {

        setLoading(true);
        setError(null);

        try {

            const data = await api.getExams();
            setExams(data);

        } catch (err) {

            setError(err.message);

        }

        setLoading(false);

    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function handleDelete(id) {

        if (!window.confirm("Delete this exam?"))
            return;

        try {

            await api.deleteExam(id);
            load();

        } catch (err) {

            alert(err.message);

        }
    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-end">

                <Button
                    onClick={() => {
                        setEditExam(null);
                        setModalOpen(true);
                    }}
                >
                    <Plus size={18} />
                    New Exam
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
                    description="Create your first exam."
                    action={
                        <Button
                            onClick={() => setModalOpen(true)}
                        >
                            <Plus size={18} />
                            New Exam
                        </Button>
                    }
                />

            ) : (

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {exams.map((exam) => {

                        const status = examStatus(exam);

                        const tone =
                            status === "active"
                                ? "success"
                                : status === "upcoming"
                                ? "warning"
                                : "neutral";

                        return (

                            <div
                                key={exam.examId}
                                className="card card-hover group flex flex-col p-5"
                            >

                                <div className="mb-3 flex items-start justify-between">

                                    <Badge tone={tone}>
                                        {status}
                                    </Badge>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">

                                        <button
                                            onClick={() => {
                                                setEditExam(exam);
                                                setModalOpen(true);
                                            }}
                                            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100"
                                        >
                                            <Pencil size={15} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(exam.examId)}
                                            className="rounded-lg p-1.5 text-red-500"
                                        >
                                            <Trash2 size={15} />
                                        </button>

                                    </div>

                                </div>

                                <h3 className="text-base font-bold">
                                    {exam.title}
                                </h3>

                                {exam.description && (

                                    <p className="mt-2 text-sm text-gray-500">
                                        {exam.description}
                                    </p>

                                )}

                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">

                                    <Spec
                                        label="Duration"
                                        value={`${exam.durationMinutes} min`}
                                    />

                                    <Spec
                                        label="Total Marks"
                                        value={exam.totalMarks}
                                    />

                                    <Spec
                                        label="Pass Marks"
                                        value={exam.passMarks}
                                    />

                                    <Spec
                                        label="Questions"
                                        value="-"
                                    />

                                </div>

                                <div className="mt-4 border-t pt-3">

                                    <p className="text-xs text-gray-500">

                                        {formatDate(exam.startDate)}

                                        {" - "}

                                        {formatDate(exam.endDate)}

                                    </p>

                                </div>

                                <div className="mt-4">

                                    <Link
                                        to={`/admin/exams/${exam.examId}`}
                                        className="btn-secondary flex-1 text-xs"
                                    >

                                        <ClipboardList size={14} />

                                        Manage

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

        <div className="rounded-lg bg-ink-50 px-2 py-1">

            <p className="text-[10px] uppercase text-gray-500">

                {label}

            </p>

            <p className="text-sm font-semibold">

                {value}

            </p>

        </div>

    );

}
