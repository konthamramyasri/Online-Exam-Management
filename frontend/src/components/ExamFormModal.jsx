import { useEffect, useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import * as api from '../lib/api';
import { todayISO } from '../lib/utils';

export function ExamFormModal({ open, onClose, onSaved, exam }) {
  const isEdit = !!exam;
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration_minutes: '30',
    total_marks: '100',
    pass_marks: '40',
    start_date: todayISO(),
    end_date: todayISO(),
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (exam) {
      setForm({
        title: exam.title,
        description: exam.description ?? '',
        duration_minutes: String(exam.durationMinutes),
        total_marks: String(exam.totalMarks),
        pass_marks: String(exam.passMarks),
        start_date: exam.startDate,
        end_date: exam.endDate,
      });
    } else {
      setForm({
        title: '',
        description: '',
        duration_minutes: '30',
        total_marks: '100',
        pass_marks: '40',
        start_date: todayISO(),
        end_date: todayISO(),
      });
    }
    setErrors({});
  }, [exam, open]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.duration_minutes || Number(form.duration_minutes) <= 0)
      e.duration_minutes = 'Duration must be greater than 0';
    if (!form.total_marks || Number(form.total_marks) <= 0)
      e.total_marks = 'Total marks must be greater than 0';
    if (form.pass_marks === '' || Number(form.pass_marks) < 0)
      e.pass_marks = 'Pass marks must be 0 or greater';
    if (Number(form.pass_marks) > Number(form.total_marks))
      e.pass_marks = 'Pass marks cannot exceed total marks';
    if (!form.start_date) e.start_date = 'Start date is required';
    if (!form.end_date) e.end_date = 'End date is required';
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      e.end_date = 'End date must be on or after start date';
    setErrors(e);
    return Object.values(e).every((v) => !v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const payload = {
      ...(isEdit ? { examId: exam.examId } : {}),
      title: form.title.trim(),
      description: form.description.trim() || null,
      durationMinutes: Number(form.duration_minutes),
      totalMarks: Number(form.total_marks),
      passMarks: Number(form.pass_marks),
      startDate: form.start_date,
      endDate: form.end_date,
    };

    try {
      await api.saveExam(payload);
    } catch (err) {
      setSaving(false);
      setErrors({ form: err.message });
      return;
    }
    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit exam' : 'Create new exam'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={saving} form="exam-form">
            {isEdit ? 'Save changes' : 'Create exam'}
          </Button>
        </>
      }
    >
      <form id="exam-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Exam title"
          name="title"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. JavaScript Fundamentals"
          error={errors.title}
        />
        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Brief description of the exam..."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Input
            label="Duration (minutes)"
            name="duration_minutes"
            type="number"
            min="1"
            value={form.duration_minutes}
            onChange={(e) => update('duration_minutes', e.target.value)}
            error={errors.duration_minutes}
          />
          <Input
            label="Total marks"
            name="total_marks"
            type="number"
            min="1"
            value={form.total_marks}
            onChange={(e) => update('total_marks', e.target.value)}
            error={errors.total_marks}
          />
          <Input
            label="Pass marks"
            name="pass_marks"
            type="number"
            min="0"
            value={form.pass_marks}
            onChange={(e) => update('pass_marks', e.target.value)}
            error={errors.pass_marks}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start date"
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={(e) => update('start_date', e.target.value)}
            error={errors.start_date}
          />
          <Input
            label="End date"
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={(e) => update('end_date', e.target.value)}
            error={errors.end_date}
          />
        </div>
        {errors.form && (
          <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
            {errors.form}
          </div>
        )}
      </form>
    </Modal>
  );
}
