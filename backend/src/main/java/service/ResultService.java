package com.exam.onlineexamsystem.service;

import com.exam.onlineexamsystem.entity.Exam;
import com.exam.onlineexamsystem.entity.Result;
import com.exam.onlineexamsystem.entity.Student;
import com.exam.onlineexamsystem.entity.Question;
import com.exam.onlineexamsystem.entity.StudentArray;
import com.exam.onlineexamsystem.repository.ExamRepository;
import com.exam.onlineexamsystem.repository.ResultRepository;
import com.exam.onlineexamsystem.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ExamRepository examRepository;

    public Result generateResult(Long studentId, Long examId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        int marksObtained = 0;
        int totalMarksEvaluated = 0;

        List<Question> questions = exam.getQuestions();
        List<StudentArray> studentAnswers = student.getStudentAnswers();

        if (questions != null && !questions.isEmpty()) {
            for (Question q : questions) {
                totalMarksEvaluated += q.getMarks();
                if (studentAnswers != null) {
                    java.util.Optional<StudentArray> answerOpt = studentAnswers.stream()
                            .filter(a -> a.getQuestion() != null && a.getQuestion().getQuestionId().equals(q.getQuestionId()))
                            .findFirst();
                    if (answerOpt.isPresent()) {
                        StudentArray studentAnswer = answerOpt.get();
                        if (q.getCorrectAnswer() != null && studentAnswer.getSelectedAnswer() != null && 
                            q.getCorrectAnswer().trim().equalsIgnoreCase(studentAnswer.getSelectedAnswer().trim())) {
                            marksObtained += q.getMarks();
                        }
                    }
                }
            }
        }

        int finalTotalMarks = totalMarksEvaluated > 0 ? totalMarksEvaluated : exam.getTotalMarks();
        int percentage = finalTotalMarks > 0 ? (marksObtained * 100) / finalTotalMarks : 0;
        boolean passed = marksObtained >= exam.getPassMarks();

        Result result = resultRepository
                .findByStudent_IdAndExam_ExamId(studentId, examId)
                .orElseGet(Result::new);
        result.setStudent(student);
        result.setExam(exam);
        result.setMarksObtained(marksObtained);
        result.setPercentage(percentage);
        result.setPassed(passed);
        result.setSubmissionDate(LocalDate.now());

        return resultRepository.save(result);
    }

    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    public Optional<Result> getResultById(Long id) {
        return resultRepository.findById(id);
    }

    public void deleteResult(Long id) {
        resultRepository.deleteById(id);
    }
}