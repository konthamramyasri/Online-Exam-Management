import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabase';

const OPTIONS = ['A', 'B', 'C', 'D'];

export function QuestionFormModal({ open, onClose, onSaved, examId }) {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [marks, setMarks] = useState('1');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setQuestionText('');
      setOptions({ A: '', B: '', C: '', D: '' });
      setCorrectAnswer('A');
      setMarks('1');
      setErrors({});
    }
  }, [open]);

  function validate() {
    const e = {};
    if (!questionText.trim()) e.questionText = 'Question text is required';
    OPTIONS.forEach((opt) => {
      if (!options[opt].trim()) e[`opt_${opt}`] = `Option ${opt} is required`;
    });
    if (!marks || Number(marks) <= 0) e.marks = 'Marks must be greater than 0';
    setErrors(e);
    return Object.values(e).every((v) => !v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const { error } = await supabase.from('questions').insert({
      exam_id: examId,
      question_text: questionText.trim(),
      option_a: options.A.trim(),
      option_b: options.B.trim(),
      option_c: options.C.trim(),
      option_d: options.D.trim(),
      correct_answer: correctAnswer,
      marks: Number(marks),
    });
    setSaving(false);

    if (error) {
      setErrors({ form: error.message });
      return;
    }
    onSaved();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add question"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={handleSubmit} loading={saving}>
            <Plus size={16} /> Save & add another
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Textarea
          label="Question text"
          name="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter the question..."
          error={errors.questionText}
        />
        <div className="space-y-3">
          <p className="text-sm font-medium text-ink-700">Answer options</p>
          {OPTIONS.map((opt) => (
            <div key={opt} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setCorrectAnswer(opt)}
                className={`mt-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                  correctAnswer === opt
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-ink-200 text-ink-400 hover:border-brand-400'
                }`}
                title="Mark as correct answer"
              >
                {opt}
              </button>
              <Input
                value={options[opt]}
                onChange={(e) => setOptions((o) => ({ ...o, [opt]: e.target.value }))}
                placeholder={`Option ${opt}`}
                error={errors[`opt_${opt}`]}
                className="flex-1"
              />
            </div>
          ))}
          <p className="text-xs text-ink-400">
            Click the letter circle to mark the correct answer. Currently correct: <span className="font-bold text-brand-600">{correctAnswer}</span>
          </p>
        </div>
        <Input
          label="Marks for this question"
          name="marks"
          type="number"
          min="1"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          error={errors.marks}
          className="max-w-[12rem]"
        />
        {errors.form && (
          <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
            {errors.form}
          </div>
        )}
      </form>
    </Modal>
  );
}

export function DeleteQuestionButton({ question, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await supabase.from('questions').delete().eq('id', question.id);
    setDeleting(false);
    onDeleted();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-lg p-2 text-ink-400 transition hover:bg-danger-50 hover:text-danger-600 disabled:opacity-50"
      title="Delete question"
    >
      <Trash2 size={16} />
    </button>
  );
}
