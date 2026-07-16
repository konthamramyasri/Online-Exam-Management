/*
# Online Examination System Schema

1. Overview
This migration creates a complete online examination platform with two user roles
(Admin and Student). Admins create and manage exams and questions. Students browse
available exams, take them within an active date window, record answers, and receive
an auto-graded result. The grading itself is performed by the frontend, which then
persists the evaluated result record.

2. New Tables
- `profiles` — extends Supabase auth.users with a display name and role (admin/student).
  - `id` (uuid, PK, references auth.users)
  - `full_name` (text, not null)
  - `role` (text, not null, check in 'admin','student')
  - `created_at` (timestamptz)
- `exams` — an exam definition created by an admin.
  - `id` (uuid, PK)
  - `title` (text, not null)
  - `description` (text)
  - `duration_minutes` (int, not null)
  - `total_marks` (int, not null)
  - `pass_marks` (numeric, not null)
  - `start_date` (date, not null)
  - `end_date` (date, not null)
  - `created_by` (uuid, references profiles, the admin who created it)
  - `created_at` (timestamptz)
- `questions` — multiple-choice questions belonging to an exam.
  - `id` (uuid, PK)
  - `exam_id` (uuid, FK to exams, cascade delete)
  - `question_text` (text, not null)
  - `option_a`, `option_b`, `option_c`, `option_d` (text, not null)
  - `correct_answer` (char(1), not null, check in A,B,C,D)
  - `marks` (int, not null, default 1)
  - `created_at` (timestamptz)
- `student_answers` — a student's selected option for a single question.
  - `id` (uuid, PK)
  - `student_id` (uuid, references profiles)
  - `exam_id` (uuid, FK to exams)
  - `question_id` (uuid, FK to questions)
  - `selected_answer` (char(1), check in A,B,C,D)
  - `created_at` (timestamptz)
  - Unique constraint per (student_id, question_id) so re-selecting updates the row.
- `results` — the graded outcome of an exam attempt, persisted by the frontend.
  - `id` (uuid, PK)
  - `student_id` (uuid, references profiles)
  - `exam_id` (uuid, FK to exams)
  - `marks_obtained` (numeric, not null)
  - `total_marks` (numeric, not null)
  - `percentage` (numeric, not null)
  - `passed` (boolean, not null)
  - `submission_date` (date, not null)
  - `created_at` (timestamptz)

3. Security (Row Level Security)
All tables enable RLS. Policies are role-aware using a subquery on `profiles.role`:
- Admins (role = 'admin') can fully manage exams, questions, and read all results
  and all student answers.
- Students (role = 'student') can:
  - Read exams and questions (the frontend enforces the active date window).
  - Insert/update/read their own student_answers.
  - Insert/read their own results.
- Profiles: each user reads/updates their own profile; admins can read all profiles.

4. Important Notes
- Owner columns (created_by, student_id) default to auth.uid() so inserts that omit
  the owner still satisfy WITH CHECK policies.
- Unique constraint on student_answers lets the frontend upsert by re-inserting;
  a unique violation triggers an update path handled client-side via upsert.
- Dates use Postgres `date` type (YYYY-MM-DD) to match the backend's LocalDate usage.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','student')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
CREATE POLICY "profiles_select_own_or_admin" ON profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "profiles_insert_self" ON profiles;
CREATE POLICY "profiles_insert_self" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- EXAMS
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration_minutes int NOT NULL CHECK (duration_minutes > 0),
  total_marks int NOT NULL CHECK (total_marks > 0),
  pass_marks numeric NOT NULL CHECK (pass_marks >= 0),
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (end_date >= start_date)
);
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exams_select_any" ON exams;
CREATE POLICY "exams_select_any" ON exams FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "exams_insert_admin" ON exams;
CREATE POLICY "exams_insert_admin" ON exams FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "exams_update_admin" ON exams;
CREATE POLICY "exams_update_admin" ON exams FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "exams_delete_admin" ON exams;
CREATE POLICY "exams_delete_admin" ON exams FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer char(1) NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
  marks int NOT NULL DEFAULT 1 CHECK (marks > 0),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "questions_select_any" ON questions;
CREATE POLICY "questions_select_any" ON questions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "questions_insert_admin" ON questions;
CREATE POLICY "questions_insert_admin" ON questions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "questions_update_admin" ON questions;
CREATE POLICY "questions_update_admin" ON questions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "questions_delete_admin" ON questions;
CREATE POLICY "questions_delete_admin" ON questions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- STUDENT_ANSWERS
CREATE TABLE IF NOT EXISTS student_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  exam_id uuid NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer char(1) CHECK (selected_answer IN ('A','B','C','D')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (student_id, question_id)
);
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "answers_select_own_or_admin" ON student_answers;
CREATE POLICY "answers_select_own_or_admin" ON student_answers FOR SELECT
  TO authenticated USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "answers_insert_own" ON student_answers;
CREATE POLICY "answers_insert_own" ON student_answers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "answers_update_own" ON student_answers;
CREATE POLICY "answers_update_own" ON student_answers FOR UPDATE
  TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "answers_delete_own" ON student_answers;
CREATE POLICY "answers_delete_own" ON student_answers FOR DELETE
  TO authenticated USING (auth.uid() = student_id);

-- RESULTS
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  exam_id uuid NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  marks_obtained numeric NOT NULL,
  total_marks numeric NOT NULL,
  percentage numeric NOT NULL,
  passed boolean NOT NULL,
  submission_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (student_id, exam_id)
);
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "results_select_own_or_admin" ON results;
CREATE POLICY "results_select_own_or_admin" ON results FOR SELECT
  TO authenticated USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "results_insert_own" ON results;
CREATE POLICY "results_insert_own" ON results FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "results_update_own" ON results;
CREATE POLICY "results_update_own" ON results FOR UPDATE
  TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "results_delete_own" ON results;
CREATE POLICY "results_delete_own" ON results FOR DELETE
  TO authenticated USING (auth.uid() = student_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_answers_student_exam ON student_answers(student_id, exam_id);
CREATE INDEX IF NOT EXISTS idx_results_student ON results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_exam ON results(exam_id);

-- Trigger: auto-create a profile row when a new auth user signs up.
-- The frontend will insert the profile row itself with the chosen role,
-- so this trigger is a safety net that only fires if no profile exists yet.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), COALESCE(NEW.raw_user_meta_data->>'role', 'student'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
