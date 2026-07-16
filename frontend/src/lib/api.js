// Thin REST client for the Spring Boot backend.
// This file is the single place that knows about HTTP — every page/component
// goes through the functions below instead of talking to `fetch` directly.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // 204 No Content / empty bodies (e.g. some DELETE endpoints return plain text)
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      (isJson && data && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

const get = (path) => request(path, { method: 'GET' });
const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
const del = (path) => request(path, { method: 'DELETE' });

// ---------------------------------------------------------------------------
// Admins
// ---------------------------------------------------------------------------
export const registerAdmin = (admin) => post('/admins/register', admin);
export const loginAdmin = (credentials) => post('/admins/login', credentials);
export const getAdmins = () => get('/admins');
export const getAdmin = (id) => get(`/admins/${id}`);
export const deleteAdmin = (id) => del(`/admins/${id}`);

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------
export const registerStudent = (student) => post('/students/register', student);
export const loginStudent = (credentials) => post('/students/login', credentials);
export const getStudents = () => get('/students');
export const getStudent = (id) => get(`/students/${id}`);
export const deleteStudent = (id) => del(`/students/${id}`);

// ---------------------------------------------------------------------------
// Exams
// ---------------------------------------------------------------------------
export const getExams = () => get('/exams');
export const getExam = (id) => get(`/exams/${id}`);
export const getQuestionsForExam = (examId) => get(`/exams/${examId}/questions`);
// Passing an examId inside `exam` updates the existing row (JPA save = upsert
// by primary key); omitting it creates a new exam.
export const saveExam = (exam) => post('/exams', exam);
export const deleteExam = (id) => del(`/exams/${id}`);

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------
export const getQuestions = () => get('/questions');
export const getQuestion = (id) => get(`/questions/${id}`);
export const saveQuestion = (question) => post('/questions', question);
export const deleteQuestion = (id) => del(`/questions/${id}`);

// ---------------------------------------------------------------------------
// Student answers
// ---------------------------------------------------------------------------
export const saveStudentAnswer = ({ studentId, questionId, selectedAnswer }) =>
  post('/studentanswers', { studentId, questionId, selectedAnswer });
export const getStudentAnswers = () => get('/studentanswers');
export const deleteStudentAnswer = (id) => del(`/studentanswers/${id}`);

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------
export const generateResult = ({ studentId, examId }) => post('/results', { studentId, examId });
export const getResults = () => get('/results');
export const getResult = (id) => get(`/results/${id}`);
export const deleteResult = (id) => del(`/results/${id}`);
