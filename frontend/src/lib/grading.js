import * as api from './api';

/**
 * Client-side preview grading, used only to show "X of Y correct" instantly
 * on the result screen. The authoritative score (marks/percentage/passed) is
 * always computed and persisted server-side in ResultService, using the
 * answers already saved via saveAnswer().
 */
export function gradeExamPreview(questions, answers) {
  let correctCount = 0;

  for (const q of questions) {
    const selected = answers[q.questionId];
    if (
      selected &&
      q.correctAnswer &&
      selected.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase()
    ) {
      correctCount++;
    }
  }

  return {
    correctCount,
    totalQuestions: questions.length,
  };
}

/**
 * Asks the backend to grade the exam (based on the answers already saved via
 * saveAnswer) and persist the result. Returns the saved Result row.
 */
export async function persistResult(studentId, examId) {
  try {
    const result = await api.generateResult({ studentId, examId });
    return { result, error: null };
  } catch (err) {
    return { result: null, error: err.message };
  }
}

/**
 * Saves (or updates) a student's answer for a single question.
 */
export async function saveAnswer(studentId, questionId, selectedAnswer) {
  try {
    await api.saveStudentAnswer({ studentId, questionId, selectedAnswer });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}
