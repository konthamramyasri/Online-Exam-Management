import { supabase } from './supabase';

/**
 * Client-side grading engine.
 * Compares each student answer against the question's correct answer,
 * sums marks for correct answers, computes percentage, and determines pass/fail.
 */
export function gradeExam(questions, answers, passMarks, totalMarks) {
  let marksObtained = 0;
  let correctCount = 0;

  for (const q of questions) {
    const selected = answers[q.id];
    if (selected && selected === q.correct_answer) {
      marksObtained += q.marks;
      correctCount++;
    }
  }

  const percentage = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;
  const passed = marksObtained >= passMarks;

  return {
    marksObtained,
    totalMarks,
    percentage: Math.round(percentage * 100) / 100,
    passed,
    correctCount,
    totalQuestions: questions.length,
  };
}

/**
 * Persists a graded result to the database.
 * Uses upsert so re-taking an exam updates the existing record.
 */
export async function persistResult(studentId, examId, graded) {
  const { error } = await supabase.from('results').upsert(
    {
      student_id: studentId,
      exam_id: examId,
      marks_obtained: graded.marksObtained,
      total_marks: graded.totalMarks,
      percentage: graded.percentage,
      passed: graded.passed,
      submission_date: new Date().toISOString().slice(0, 10),
    },
    { onConflict: 'student_id,exam_id' },
  );
  return { error: error?.message ?? null };
}

/**
 * Saves a student's answer for a single question (upsert by student+question).
 */
export async function saveAnswer(studentId, examId, questionId, selectedAnswer) {
  const { error } = await supabase.from('student_answers').upsert(
    {
      student_id: studentId,
      exam_id: examId,
      question_id: questionId,
      selected_answer: selectedAnswer,
    },
    { onConflict: 'student_id,question_id' },
  );
  return { error: error?.message ?? null };
}
